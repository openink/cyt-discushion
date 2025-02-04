const originStyle = "position:absolute;top:-12914rem;left:-12914rem;";

/**将任何长度单位或 css 变量转换为像素值*/
export function getPx(value :number | string) :number{
    if(value === 0) return 0;
    let testEl :HTMLElement | null = document.getElementById("getPx_test");
    if(!testEl){
        testEl = document.createElement("div");
        testEl.id = "getPx_test";
        document.body.appendChild(testEl);
    }
    testEl.setAttribute("style", `${originStyle}height:${value}`);
    const result = parseFloat(getComputedStyle(testEl).height);
    testEl.setAttribute("style", originStyle);
    return result;
}