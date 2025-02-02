import styles from "./App.module.css";
import Editor from "../Editor/Editor";
import Sidebar from "../Sidebar/Sidebar";

export default function App(){
    return(<>
        <Sidebar />
        <Editor />
    </>);
}