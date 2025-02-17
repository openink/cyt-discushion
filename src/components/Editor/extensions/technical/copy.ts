import { DOMSerializer } from "@tiptap/pm/model";
import { Plugin } from "@tiptap/pm/state";
import { Extension } from "@tiptap/react";

const Copy = Extension.create({
    name: "copy",
    addProseMirrorPlugins(){return[new Plugin({
        props: { handleDOMEvents: { copy(view, event){
            event.preventDefault();
            const {state} = view, {selection} = state, div = document.createElement("div");
            div.appendChild(DOMSerializer.fromSchema(state.schema).serializeFragment(selection.content().content));
            for(let i = 0; i < div.childNodes.length; i++) if(div.childNodes[i].textContent?.trim() === "") div.childNodes[i].remove();
            let textContent = "";
            for(let i = 0; i < div.childNodes.length; i++){
                const node = div.childNodes[i];
                textContent += node.textContent;
                if(i < div.childNodes.length - 1) textContent += "\n\n";
            }
            event.clipboardData?.setData("text/plain", textContent);
            event.clipboardData?.setData("text/html", div.innerHTML);
        }}}
    })]}
});

export default Copy;