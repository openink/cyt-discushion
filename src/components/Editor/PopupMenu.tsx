import { getPx } from "../../utils/css";
import styles from "./PopupMenu.module.css";
import gStyles from "../../css/main.module.css";
import { BubbleMenu, Editor } from "@tiptap/react";
import { useCallback } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../Tooltip/Tooltip";

interface EditorProps{
    editor :Editor;
}

type ChildrenProps = React.HTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>;

export default function PopupMenu({editor} :EditorProps){
    return(<BubbleMenu className={`${styles.outer} ${gStyles.noselect}`} editor={editor}>
        {editor.state.selection.$anchor.parent === editor.state.selection.$head.parent &&
            <>
                <BlockTypeSelecter editor={editor} />
                <div className={styles.separatorOuter}><div className={styles.separator} /></div>
            </>
        }
        <Tooltip>
            <TooltipTrigger
                className={`${styles.markButton}${editor.isActive("bold") ? ` ${styles.active}` : ""}`}
                onClick={()=>{editor.chain().focus().toggleBold().run()}}
                disabled={!editor.can().toggleBold()}
            ><svg viewBox="0 0 32 32"><path fill="currentColor" d="M18.25 25H9V7h8.5a5.25 5.25 0 0 1 4 8.65A5.25 5.25 0 0 1 18.25 25M12 22h6.23a2.25 2.25 0 1 0 0-4.5H12Zm0-7.5h5.5a2.25 2.25 0 1 0 0-4.5H12Z" /></svg></TooltipTrigger>
            <TooltipContent>
                <div>加粗</div>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger
                className={`${styles.markButton}${editor.isActive("italic") ? ` ${styles.active}` : ""}`}
                onClick={()=>{editor.chain().focus().toggleItalic().run()}}
                disabled={!editor.can().toggleItalic()}
            ><svg viewBox="0 0 32 32"><path fill="currentColor" d="M25 9V7H12v2h5.14l-4.37 14H7v2h13v-2h-5.14l4.37-14z" /></svg></TooltipTrigger>
            <TooltipContent>
                <div>斜体</div>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger
                className={`${styles.markButton}${editor.isActive("underline") ? ` ${styles.active}` : ""}`}
                onClick={()=>{editor.chain().focus().toggleUnderline().run()}}
                disabled={!editor.can().toggleUnderline()}
            ><svg viewBox="0 0 32 32"><path fill="currentColor" d="M4 26h24v2H4zm12-3a7 7 0 0 1-7-7V5h2v11a5 5 0 0 0 10 0V5h2v11a7 7 0 0 1-7 7"></path></svg></TooltipTrigger>
            <TooltipContent>
                <div>下划线</div>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger
                className={`${styles.markButton}${editor.isActive("strike") ? ` ${styles.active}` : ""}`}
                onClick={()=>{editor.chain().focus().toggleStrike().run()}}
                disabled={!editor.can().toggleStrike()}
            ><svg viewBox="0 0 32 32"><path fill="currentColor" d="M28 15H17.956a40 40 0 0 0-1.338-.335c-2.808-.664-4.396-1.15-4.396-3.423a2.87 2.87 0 0 1 .787-2.145a4.8 4.8 0 0 1 3.013-1.09c2.83-.07 4.135.89 5.202 2.35l1.615-1.18a7.47 7.47 0 0 0-6.83-3.17a6.77 6.77 0 0 0-4.4 1.661a4.83 4.83 0 0 0-1.386 3.574A4.37 4.37 0 0 0 11.957 15H4v2h13.652c1.967.57 3.143 1.312 3.173 3.358a3.12 3.12 0 0 1-.862 2.393A5.82 5.82 0 0 1 16.243 24a6.63 6.63 0 0 1-5.145-2.691l-1.533 1.284A8.53 8.53 0 0 0 16.212 26h.1a7.67 7.67 0 0 0 5.048-1.819a5.08 5.08 0 0 0 1.465-3.853A4.95 4.95 0 0 0 21.675 17H28Z" /></svg></TooltipTrigger>
            <TooltipContent>
                <div>删除线</div>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger
                className={`${styles.markButton}${editor.isActive("code") ? ` ${styles.active}` : ""}`}
                onClick={()=>{editor.chain().focus().toggleCode().run()}}
                disabled={!editor.can().toggleCode()}
            ><svg viewBox="0 0 32 32"><path fill="currentColor" d="m31 16l-7 7l-1.41-1.41L28.17 16l-5.58-5.59L24 9zM1 16l7-7l1.41 1.41L3.83 16l5.58 5.59L8 23zm11.42 9.484L17.64 6l1.932.517L14.352 26z" /></svg></TooltipTrigger>
            <TooltipContent>
                <div>行内代码</div>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger
                className={`${styles.markButton}${editor.isActive("code") ? ` ${styles.active}` : ""}`}
                onClick={()=>{editor.chain().focus().toggleCode().run()}}
                disabled={!editor.can().toggleCode()}
            ><svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} color="currentColor"><path d="M22 5h-8.386c-1.234 0-1.649.14-1.955 1.364l-2.32 9.278c-.55 2.198-.824 3.297-1.554 3.356s-1.235-.978-2.244-3.05l-.57-1.173c-.436-.893-.653-1.34-1.092-1.46c-.662-.182-1.37.355-1.879.685" /><path d="M14.4 11.004c.78-.085 1.734.034 2.04.636c.612 1.2 1.62 3.72 1.98 4.5c.18.3.36.66 1.08.84c.48.06 1.104.015 1.104.015" /><path d="M21 10.998c-1.5 0-2.46 1.662-3.3 2.682c-1.08 1.56-2.28 3.42-3.72 3.3" /></g></svg></TooltipTrigger>
            <TooltipContent>
                <div>行内公式</div>
            </TooltipContent>
        </Tooltip>
        <LinkPrompt editor={editor} />
        <div className={styles.separator} />
    </BubbleMenu>);
}

function BlockTypeSelecter({editor} :EditorProps){
    return(<Tooltip>
        <TooltipTrigger className={styles.selectButton}>
            <svg viewBox="0 0 24 24"><path stroke="var(--c-grey-5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m7 10l5 5m0 0l5-5" /></svg>
            {editor.state.selection.$anchor.parent.type.name}
        </TooltipTrigger>
        <TooltipContent>区块格式</TooltipContent>
    </Tooltip>);
}

function LinkPrompt({editor} :EditorProps){
    const clickCB = useCallback((event :React.MouseEvent<HTMLButtonElement>)=>{
        console.log(event);
    }, []);
    const _1rem = getPx("1rem");
    return(<Tooltip>
        <TooltipTrigger className={styles.selectButton} onClick={clickCB}>
            <svg viewBox="0 0 24 24"><path stroke="var(--c-grey-5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m7 10l5 5m0 0l5-5" /></svg>
            <svg viewBox="0 0 32 32"><path fill="currentColor" d="M29.25 6.76a6 6 0 0 0-8.5 0l1.42 1.42a4 4 0 1 1 5.67 5.67l-8 8a4 4 0 1 1-5.67-5.66l1.41-1.42l-1.41-1.42l-1.42 1.42a6 6 0 0 0 0 8.5A6 6 0 0 0 17 25a6 6 0 0 0 4.27-1.76l8-8a6 6 0 0 0-.02-8.48" /><path fill="currentColor" d="M4.19 24.82a4 4 0 0 1 0-5.67l8-8a4 4 0 0 1 5.67 0A3.94 3.94 0 0 1 19 14a4 4 0 0 1-1.17 2.85L15.71 19l1.42 1.42l2.12-2.12a6 6 0 0 0-8.51-8.51l-8 8a6 6 0 0 0 0 8.51A6 6 0 0 0 7 28a6.07 6.07 0 0 0 4.28-1.76l-1.42-1.42a4 4 0 0 1-5.67 0" /></svg>
        </TooltipTrigger>
        <TooltipContent>链接</TooltipContent>
    </Tooltip>);
}