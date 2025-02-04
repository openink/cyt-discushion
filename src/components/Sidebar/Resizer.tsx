import { Component as Cp } from "react";
import styles from "./Resizer.module.css";
import { configTable } from "../../data/db";
import { DcConfigEntry } from "../../data/config";
import { Table } from "dexie";
import { getPx } from "../../utils/css";
import { minMax } from "@tiptap/core";

type Props = {
    setWidth :React.Dispatch<React.SetStateAction<number>>;
}

type State = {
    resizing :boolean;
};

export default class Resizer extends Cp<Props, State>{
    deltaX :number = 0;
    constructor(props :Props){
        super(props);
        this.state = {
            resizing: false
        };
    }
    componentDidMount(){
        document.addEventListener("mousemove", this.mouseMoveCB);
        document.addEventListener("mouseup", this.mouseUpCB);
    }
    componentWillUnmount(){
        document.removeEventListener("mousemove", this.mouseMoveCB);
        document.removeEventListener("mouseup", this.mouseUpCB);
    }
    mouseDownCB = (event :React.MouseEvent<HTMLDivElement>)=>{
        if(!this.state.resizing){
            let width = 0;
            this.props.setWidth(_width=>{
                width = _width;
                return _width;
            });
            this.deltaX = event.pageX - width;
            this.setState({resizing: true});
            document.body.classList.add("noselect", "nodrag");
        }
    }
    mouseMoveCB = (event :MouseEvent)=>{
        if(this.state.resizing){
            if(event.buttons) this.props.setWidth(minMax(event.pageX - this.deltaX, getPx("5rem"), getPx("50dvw")));
            else this.reset();
        }
    }
    mouseUpCB = (event :MouseEvent)=>{
        if(this.state.resizing) this.reset();
    }
    reset = async ()=>{
        document.body.classList.remove("noselect", "nodrag");
        this.setState({resizing: false});
        this.props.setWidth(width=>{
            (configTable as Table<DcConfigEntry<"sidebarWidth">>).put({key: "sidebarWidth", value: width});
            return width;
        });
    }
    render(){
        return(
            <div className={styles.resizerOuter}>
                <div className={styles.resizer} onMouseDown={this.mouseDownCB}>
                    <div className={styles.resizerInner} />
                </div>
            </div>
        );
    }
}