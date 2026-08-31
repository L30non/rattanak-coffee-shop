#!/usr/bin/env node
/**
 * One-shot codemod: wraps user-facing strings in components with t(...) and
 * adds the useI18n() hook where needed.
 *
 *   node scripts/i18n-codemod.mjs --dry app/components/Cart.tsx   # preview
 *   node scripts/i18n-codemod.mjs app/components/Cart.tsx         # write
 *
 * It edits by character range taken from the AST rather than regenerating
 * code, so formatting and comments survive untouched and diffs stay readable.
 *
 * Deliberately conservative — it converts plain JSX text and a whitelist of
 * user-facing attributes only. Template literals, toasts and strings in
 * module-level data are left alone for a human pass.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";

const traverse = _traverse.default ?? _traverse;

const TRANSLATABLE_ATTRS = new Set([
  "placeholder",
  "aria-label",
  "title",
  "alt",
  "label",
]);

const ENTITIES = {
  "&apos;": "'",
  "&quot;": '"',
  "&amp;": "&",
  "&mdash;": "—",
  "&ndash;": "–",
  "&nbsp;": " ",
  "&hellip;": "…",
  "&times;": "×",
};

function decodeEntities(text) {
  return text.replace(/&[a-z]+;/g, (match) => ENTITIES[match] ?? match);
}

/** Worth translating? Skip numbers, punctuation, symbols and single letters. */
function isTranslatable(text) {
  const trimmed = text.trim();
  if (trimmed.length < 2) return false;
  if (!/[A-Za-z]/.test(trimmed)) return false;
  // Bare interpolation leftovers or pure symbols like "·" / "—".
  if (/^[^A-Za-z]*$/.test(trimmed)) return false;
  return true;
}

function toJsString(value) {
  return JSON.stringify(value);
}

function processFile(filePath, { dry }) {
  const original = readFileSync(filePath, "utf8");
  let ast;
  try {
    ast = parse(original, { sourceType: "module", plugins: ["typescript", "jsx"] });
  } catch (error) {
    console.error(`${filePath}: parse error — ${error.message}`);
    return { changed: false };
  }

  const edits = [];
  // Component fn -> position to insert the hook call.
  const hookTargets = new Map();
  // Strings the codemod refuses to touch, reported for a manual pass.
  const manual = [];

  /** Nearest module-level component function containing this node. */
  function enclosingComponent(nodePath) {
    let current = nodePath;
    let candidate = null;
    while (current) {
      const { node, parent } = current;
      if (
        node.type === "FunctionDeclaration" &&
        node.id &&
        /^[A-Z]/.test(node.id.name)
      ) {
        candidate = node;
      }
      if (
        (node.type === "ArrowFunctionExpression" ||
          node.type === "FunctionExpression") &&
        parent &&
        parent.type === "VariableDeclarator" &&
        parent.id.type === "Identifier" &&
        /^[A-Z]/.test(parent.id.name)
      ) {
        candidate = node;
      }
      current = current.parentPath;
    }
    return candidate;
  }

  function registerHook(nodePath) {
    const component = enclosingComponent(nodePath);
    if (!component) return false;
    if (component.body.type !== "BlockStatement") return false;
    if (!hookTargets.has(component)) {
      hookTargets.set(component, component.body.start + 1);
    }
    return true;
  }

  /**
   * True when this text sits alongside a real interpolated expression, e.g.
   * `Order #{order.id}`. Translating such a fragment on its own produces
   * broken grammar in languages that reorder clauses, so those are left for
   * a human to rewrite as t("Order #{id}", { id }).
   *
   * `{" "}` is only JSX whitespace glue, never real interpolation.
   */
  function hasInterpolatedSibling(nodePath) {
    const parent = nodePath.parent;
    if (!parent || !Array.isArray(parent.children)) return false;
    return parent.children.some(
      (child) =>
        child.type === "JSXExpressionContainer" &&
        child.expression.type !== "JSXEmptyExpression" &&
        child.expression.type !== "StringLiteral",
    );
  }

  traverse(ast, {
    JSXText(nodePath) {
      const raw = nodePath.node.value;
      // JSX collapses runs of whitespace/newlines when rendering; match that
      // so the key equals what the user actually sees.
      const collapsed = decodeEntities(raw).replace(/\s+/g, " ").trim();
      if (!isTranslatable(collapsed)) return;
      if (hasInterpolatedSibling(nodePath)) {
        manual.push(`${filePath}: ${JSON.stringify(collapsed)}`);
        return;
      }
      if (!registerHook(nodePath)) return;

      const leading = raw.match(/^\s*/)[0];
      const trailing = raw.match(/\s*$/)[0];
      edits.push({
        start: nodePath.node.start,
        end: nodePath.node.end,
        text: `${leading}{t(${toJsString(collapsed)})}${trailing}`,
      });
    },

    JSXAttribute(nodePath) {
      const { name, value } = nodePath.node;
      if (!value || value.type !== "StringLiteral") return;
      const attrName =
        name.type === "JSXIdentifier"
          ? name.name
          : `${name.namespace.name}:${name.name.name}`;
      if (!TRANSLATABLE_ATTRS.has(attrName)) return;
      const text = decodeEntities(value.value).trim();
      if (!isTranslatable(text)) return;
      if (!registerHook(nodePath)) return;

      edits.push({
        start: value.start,
        end: value.end,
        text: `{t(${toJsString(text)})}`,
      });
    },

    // toast.success("Saved") and friends. Template literals carry runtime
    // values, so those are reported for the manual pass instead.
    CallExpression(nodePath) {
      const { callee, arguments: callArgs } = nodePath.node;
      const isToast =
        callee.type === "MemberExpression" &&
        callee.object.type === "Identifier" &&
        callee.object.name === "toast";
      if (!isToast || callArgs.length === 0) return;

      const first = callArgs[0];
      if (first.type === "TemplateLiteral") {
        const preview = original.slice(first.start, first.end).replace(/\s+/g, " ");
        manual.push(`${filePath}: toast ${preview}`);
        return;
      }
      if (first.type !== "StringLiteral") return;
      if (!isTranslatable(first.value)) return;
      if (!registerHook(nodePath)) return;

      edits.push({
        start: first.start,
        end: first.end,
        text: `t(${toJsString(first.value)})`,
      });
    },
  });

  if (edits.length === 0) return { changed: false, manual };

  // Insert the hook as the first statement of each component that needs it.
  for (const position of hookTargets.values()) {
    edits.push({
      start: position,
      end: position,
      text: "\n  const { t } = useI18n();\n",
    });
  }

  // Add the import after the final existing import.
  if (!original.includes('from "@/lib/i18n"')) {
    let lastImportEnd = 0;
    for (const node of ast.program.body) {
      if (node.type === "ImportDeclaration") lastImportEnd = node.end;
    }
    edits.push({
      start: lastImportEnd,
      end: lastImportEnd,
      text: '\nimport { useI18n } from "@/lib/i18n";',
    });
  }

  // Apply back-to-front so earlier offsets stay valid.
  edits.sort((a, b) => b.start - a.start || b.end - a.end);
  let output = original;
  for (const edit of edits) {
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
  }

  const stringCount = edits.filter((e) => e.text.includes("t(")).length;
  if (dry) {
    console.log(`\n=== ${filePath} (${stringCount} strings) ===`);
    console.log(output.split("\n").slice(0, 60).join("\n"));
  } else {
    writeFileSync(filePath, output, "utf8");
  }
  return { changed: true, count: stringCount, manual };
}

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const files = args.filter((a) => !a.startsWith("--"));

if (files.length === 0) {
  console.error("Usage: node scripts/i18n-codemod.mjs [--dry] <files...>");
  process.exit(1);
}

let total = 0;
const allManual = [];
for (const file of files) {
  const { changed, count, manual } = processFile(file, { dry });
  if (manual) allManual.push(...manual);
  if (changed) {
    total += count;
    if (!dry) console.log(`${file}: ${count} strings`);
  }
}
console.log(`\n${dry ? "Would convert" : "Converted"} ${total} strings across ${files.length} files`);

if (allManual.length) {
  console.log(
    `\n${allManual.length} strings need a manual pass (interpolated text / template literals):`,
  );
  for (const entry of allManual) console.log(`  - ${entry}`);
}
