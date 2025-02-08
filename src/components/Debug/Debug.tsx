
type Props = {
    cursorAnchor :number;
    cursorFocus :number;
    docSize :number;
};

export default function Debug({cursorAnchor, cursorFocus, docSize} :Props){
    return(<div style={{
        position: "absolute",
        fontSize: ".9rem",
        top: "2rem",
        left: "2rem",
        zIndex: "6666666"
    }}>
        <div>pos: {cursorAnchor === cursorFocus ? cursorAnchor : `${cursorAnchor}-${cursorFocus}`}</div>
        <div>size: {docSize}</div>
    </div>);
}