import React, { Component } from "react";
import Counter from "./Counter";
import "./Container1.css";
import { connect } from "react-redux";
import {
  at_getData,
  at_togglePermit,
  at_changeValue,
  at_addParent,
  at_subParent,
  atx_fetchData,
  atx_click,
  atx_deleteChild,
  atx_blur
} from "../actions/Actions";
const uuid = require("uuid");

let counterResult = {
  dad: { id:"0", value:0, role: 1}, child: []
};
//------------------------------------------------------------------------
class Container1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onClickCounter = (id, isUp, role, value) => () => {
    this.props.atx_click(id, isUp, role, value, this.props.isPermit);
  }
  onDeleteElem = (id, role) => () => {
    this.props.atx_deleteChild(id, role, this.props.isPermit);
  }
  onBlurCounter = (id, role, oldValue, newValue) => {
    this.props.atx_blur(id, role, oldValue, newValue);
  }

  componentWillMount(){
    this.props.atx_fetchData(this.props.isPermit);
    
  }
  render() {
    counterResult = this.props.counters.reduce(
      (a, item) => {
        if (item.role === 1) a.dad = { ...item };
        else a.child.push(item);
        return a;
      },
      { dad: {}, child: [] }
    );
    return (
      <div>
        <div className="dad">
          <Counter
            id={counterResult.dad.id}
            role={counterResult.dad.role}
            value={counterResult.dad.value}
            onClickCounter={this.onClickCounter}
            onBlurCounter={this.onBlurCounter}
          />
        </div>
        <div>
          {
            counterResult.child.map(item => { 
            return (
              <div className="counter-child" key={item.id}>
                <Counter
                  key={uuid()}
                  id={item.id}
                  role={item.role}
                  value={item.value}
                  onClickCounter={this.onClickCounter}
                  onBlurCounter={this.onBlurCounter}
                />
                <button
                  className="btn-clear"
                  onClick={this.onDeleteElem(item.id,item.role)}
                >
                  X
                </button>
              </div>
            )
            })
          }
        </div>
        <div />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state
  };
}
function mapDispatchToProps(dispatch) {
  return {
    at_getData: (arr)          => dispatch(at_getData(arr)),
    at_togglePermit: ()        => dispatch(at_togglePermit()),
    at_changeValue: (id,value) => dispatch(at_changeValue(id,value)),
    at_addParent: (arr)        => dispatch(at_addParent(arr)),
    at_subParent: (arr)        => dispatch(at_subParent(arr)),
    atx_fetchData: (isPermit)          => dispatch(atx_fetchData(isPermit)),
    atx_click: (id, isUp, role, value, isPermit) => dispatch(atx_click(id, isUp, role, value, isPermit)),
    atx_deleteChild: (id, role, isPermit) => dispatch(atx_deleteChild(id, role, isPermit)),
    atx_blur: (id, role, oldValue, newValue, isPermit) => dispatch(atx_blur(id, role, oldValue, newValue, isPermit)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container1);