import {render} from "@master/css/render";
import { StyleSheet } from '@master/css';
import * as htmlparser from 'htmlparser2'
import * as domutils from 'domutils';
import * as renderdom from "dom-serializer";
import * as domhandler from 'domhandler';

(async () => {
    const html = await Bun.file("index.html").text();
    const dom = htmlparser.parseDocument(html);

    const scripts = domutils.getElementsByTagName("script", dom)
    for (let script of scripts) {
        const src = domutils.getAttributeValue(script, "src")
        if (src === "https://cdn.master.co/css") {
            domutils.removeElement(script)
        }
    }

    const [style] = domutils.getElementsByTagName("style", dom)
    const [text] = domutils.getChildren(style)
    const currentCss = text.data;

    const {css} = render(html, {StyleSheet})
    domutils.replaceElement(style, new domhandler.Element("style", {}, [
        new domhandler.Text(currentCss + '\n\r' + css + '\n\r')
    ]))

    await Bun.write("index.html", renderdom.default(dom, {
        decodeEntities: false,
        encodeEntities: false,
    }));
})();