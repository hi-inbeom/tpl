const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // HTML 태그 자동완성 제공자
    const provider = vscode.languages.registerCompletionItemProvider('tpl', {
        provideCompletionItems(document, position, token, context) {
            const completionItems = [];
            
            // 일반 HTML 태그 목록 (닫는 태그가 필요한 태그들)
            const htmlTags = [
                'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'button', 'form', 'label', 'textarea', 'select', 'option',
                'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody',
                'header', 'footer', 'nav', 'main', 'section', 'article', 'aside',
                'a', 'strong', 'em', 'code', 'pre', 'blockquote',
                'script', 'style', 'title', 'head', 'body', 'html',
                // SVG 태그들
                'svg', 'g', 'defs', 'clipPath', 'mask', 'pattern', 'symbol', 'marker',
                'linearGradient', 'radialGradient', 'text', 'tspan', 'textPath',
                'polyline', 'polygon', 'path', 'rect', 'circle', 'ellipse', 'line'
            ];

            // 각 태그에 대한 자동완성 아이템 생성
            htmlTags.forEach(tag => {
                const completionItem = new vscode.CompletionItem(tag, vscode.CompletionItemKind.Snippet);
                
                // 자동완성 시 삽입될 텍스트 (커서 위치도 포함)
                // $0은 최종 커서 위치, $1, $2 등으로 탭 이동 순서 지정 가능
                completionItem.insertText = new vscode.SnippetString(`<${tag}>$0</${tag}>`);
                
                // 자동완성 목록에서 보여질 세부 정보
                completionItem.detail = `<${tag}></${tag}>`;
                completionItem.documentation = `Insert ${tag} tag with cursor positioned between tags`;
                
                // 자동완성 우선순위 (높을수록 위에 표시)
                completionItem.sortText = tag;
                
                completionItems.push(completionItem);
            });

            // self-closing 태그들 (XHTML 스타일로 /를 포함)
            const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
            
            selfClosingTags.forEach(tag => {
                const completionItem = new vscode.CompletionItem(tag, vscode.CompletionItemKind.Snippet);
                // XHTML 스타일: <input /> (슬래시 포함)
                completionItem.insertText = new vscode.SnippetString(`<${tag} $0/>`);
                completionItem.detail = `<${tag} />`;
                completionItem.documentation = `Insert self-closing ${tag} tag (XHTML style)`;
                completionItem.sortText = tag;
                
                completionItems.push(completionItem);
            });

            return completionItems;
        }
    });

    context.subscriptions.push(provider);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}