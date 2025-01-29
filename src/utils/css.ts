/**将任何长度单位或 css 变量转换为像素值*/
const getPx_test = document.createElement("div"), originStyle = "position:absolute;top:-12914rem;left:-12914rem;";
getPx_test.setAttribute("style", originStyle);
export function mountGetPx(){
    document.body.appendChild(getPx_test);
}
export function getPx(value :number | string) :number{
    if(value === 0) return 0;
    getPx_test.setAttribute("style", originStyle + `height:${value}`);
    const result = parseFloat(getComputedStyle(getPx_test).height);
    getPx_test.setAttribute("style", originStyle);
    return result;
}