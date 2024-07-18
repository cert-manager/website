// This file originates from https://github.com/facebook/docusaurus/issues/395#issuecomment-1727777067

import { visit } from 'unist-util-visit'

export default function plugin(options) {
    return async (ast) => {
        visit(ast, ['text', 'code', 'inlineCode', 'link'], (node) => {
            // Replace all occurrences of VAR::varName with the value of varName
            let value;
            switch (node.type) {
                case "link":
                    value = node.url;
                    break;

                case "text":
                case "code":
                case "inlineCode":
                    value = node.value;
                break;
            }

            value = value.replace(/\[\[VAR::([a-zA-Z_]+)\]\]/ig, (match, varName) => {
                return options.replacements[varName] || match;
            });

            switch (node.type) {
                case "link":
                    node.url = value;
                    break;

                case "text":
                case "code":
                case "inlineCode":
                    node.value = value;
                    break;
            }
        });
    };
}
