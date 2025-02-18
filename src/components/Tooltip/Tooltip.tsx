//https://codesandbox.io/p/sandbox/xenodochial-grass-js3bo9
import { cloneElement, createContext, forwardRef, isValidElement, useContext, useMemo, useState } from "react";
import { useFloating, autoUpdate, offset, flip, shift, useHover, useFocus, useDismiss, useRole, useInteractions, useMergeRefs, FloatingPortal } from "@floating-ui/react";
import { Placement } from "@floating-ui/react";
import styles from "./Tooltip.module.css";

interface TooltipOptions{
    initialOpen? :boolean;
    placement? :Placement;
    open? :boolean;
    onOpenChange? :(open: boolean)=>void;
}

export function useTooltip({initialOpen = false, placement = "top", open: controlledOpen, onOpenChange: setControlledOpen} :TooltipOptions = {}){
    const
    [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen),
    open = controlledOpen ?? uncontrolledOpen,
    setOpen = setControlledOpen ?? setUncontrolledOpen,
    data = useFloating({placement, open, onOpenChange: setOpen, whileElementsMounted: autoUpdate,
        middleware: [
            offset(6),
            flip({
                crossAxis: placement.includes("-"),
                fallbackAxisSideDirection: "start",
                padding: 5
            }),
            shift({padding: 2})
        ]
    }),
    context = data.context,
    hover = useHover(context, {
        move: false,
        enabled: controlledOpen == null,
        restMs: 200
    }),
    focus = useFocus(context, {enabled: controlledOpen == null}),
    dismiss = useDismiss(context),
    role = useRole(context, {role: "tooltip"}),
    interactions = useInteractions([hover, focus, dismiss, role]);
    return useMemo(()=>({open, setOpen, ...interactions, ...data}), [open, setOpen, interactions, data]);
}

const TooltipContext = createContext<ReturnType<typeof useTooltip> | null>(null);

export const useTooltipContext = ()=>{
    const context = useContext(TooltipContext);
    if(context == null) throw new Error("Tooltip components must be wrapped in <Tooltip />");
    return context;
};

export function Tooltip({children, ...options} :{children :React.ReactNode} & TooltipOptions){
    const tooltip = useTooltip(options);
    return(<TooltipContext.Provider value={tooltip}>
        {children}
    </TooltipContext.Provider>);
}

//`As` 只放div是为了防止太多类型导致ts类型引擎爆炸，可按需添加原生元素
export const TooltipTrigger = forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & {asChild?: boolean; As? :"div"}>(({children, asChild = false, As, ...props}, propRef)=>{
    const
    context = useTooltipContext(),
    childrenRef = (children as any).ref,
    ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);
    if(asChild && isValidElement(children)) return cloneElement(
        children,
        context.getReferenceProps({
            ref,
            ...props,
            ...children.props,
            "data-state": context.open ? "open" : "closed"
        })
    )
    if(As) return(<As
        ref={ref}
        data-state={context.open ? "open" : "closed"}
        {...context.getReferenceProps(props)}
    >{children}</As>);
    else return(<button
        ref={ref}
        data-state={context.open ? "open" : "closed"}
        {...context.getReferenceProps(props)}
    >{children}</button>);
});

export const TooltipContent = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(({style, ...props}, propRef)=>{
    const
    context = useTooltipContext(),
    ref = useMergeRefs([context.refs.setFloating, propRef]);
    if(!context.open) return null;
    return(<FloatingPortal>
        <div
            className={styles.tooltip}
            ref={ref}
            style={{
                ...context.floatingStyles,
                ...style
            }}
            {...context.getFloatingProps(props)}
        />
    </FloatingPortal>);
});