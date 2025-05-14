import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"
import Header from "./component/header/js/Header"
import Mypage from "./component/mypage/js/Mypage";
import {BrowserRouter} from "react-router-dom";
import {useState} from "react";

function App() {
    const [CheckHeader, CheckChangeHeader] = useState("아직 안바뀜");
    function ChangeEventHandler(text) {
        CheckChangeHeader(text);
    }
    return (
        <div className="App" style={{"overflow":"hidden"}}>
            <BrowserRouter>
                <Header CheckHeader={CheckHeader} ChangeEventHandler={ChangeEventHandler}/>
                <Mypage />
            </BrowserRouter>
        </div>
    );
}

export default App;
