import {render} from "@master/css/render";
import { StyleSheet } from '@master/css';
import * as htmlparser from 'htmlparser2'
import * as domutils from 'domutils';
import * as renderdom from "dom-serializer";
import * as domhandler from 'domhandler';

(async () => {
    const html = await Bun.file("index.html").text();
    const dom = htmlparser.parseDocument(html);

    const [head] = domutils.getElementsByTagName("head", dom)
    for (let element of head.children) {
        const elementType = domutils.getName(element)
        if (elementType === "script") {
            const src = domutils.getAttributeValue(element, "src")
            if (src === "https://cdn.master.co/css") {
                domutils.removeElement(element)
            }
        }
    }

    const {css} = render(html, {StyleSheet})
    domutils.appendChild(head, new domhandler.Element("style", {}, [
        new domhandler.Text(css)
    ]))

    await Bun.write("index.html", renderdom.default(dom, {
        decodeEntities: false,
        encodeEntities: false,
    }));
})();