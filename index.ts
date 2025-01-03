import {render} from "@master/css/render";
import { StyleSheet } from '@master/css';

(async () => {
    const html = await Bun.file("index.html").text();
    const {css} = render(html, {StyleSheet})
    await Bun.write("index.css", css);
})();