import React, { Component } from "react";
import axios from "axios";
import Counter from "./Counter";
import "./Container1.css";
import { connect } from "react-redux";
import {
  HOST,
  KEY_PARENT_DECREASE,
  KEY_PARENT_INCREASE,
  KEY_UPDATE_CHILD,
  KEY_DELETE_CHILD
} from "../constants";
import {
  at_getData,
  at_togglePermit,
  at_changeValue,
  at_addParent,
  at_subParent,
  atx_fetchData,
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
    if (this.props.isPermit) {
      this.props.at_togglePermit();
      const oldValue= this.props.counters.filter((item)=>{
        if (item.id === id) return true;return false;
      })[0].value;
      let link = `${HOST}`;
      const newValue = isUp?oldValue+1:oldValue-1;
      let info = {
        id,
        role,
        oldValue,
        newValue
      };
      if (oldValue === 0 && !isUp){
        this.props.at_togglePermit();
      } else {
        axios.post(link,info)
        .then((res) => {
          this.props.at_togglePermit();
          this.props.at_changeValue(res.data.id,parseInt(res.data.value,10));
          switch (res.data.key){
            case KEY_UPDATE_CHILD:
              break;
            case KEY_PARENT_INCREASE:
              this.props.at_addParent(res.data.content);
              break;
            case KEY_PARENT_DECREASE:
              this.props.at_subParent(res.data.content);
              break;
            default:
              break;
          }
        });
      }
    }
  }
  onDeleteElem = (id, role) => () => {
    if (this.props.isPermit) {
      this.props.at_togglePermit();
      const link = `${HOST}?id=${id}&role=${role}`;
      axios.delete(link)
      .then((res)=> {
        this.props.at_togglePermit();
        this.props.at_changeValue(res.data.id,parseInt(res.data.value,10));
        switch (res.data.key){
          case KEY_DELETE_CHILD:
            this.props.at_subParent(res.data.content);
            break;
          default:
            break;
        }
      });
    }
  }
  onBlurCounter = (id, role, oldValue, newValue) => {
    if (this.props.isPermit) {
      this.props.at_togglePermit();
      if ( newValue === oldValue ) {
        this.props.at_togglePermit();
      } else {
        let link = `${HOST}`;
        let info = {id:id,role:role,oldValue:oldValue,newValue:newValue};
        axios.post(link,info)
        .then((res) => {
          this.props.at_togglePermit();
          this.props.at_changeValue(res.data.id,parseInt(res.data.value,10));
          switch (res.data.key){
            case KEY_UPDATE_CHILD:
              break;
            case KEY_PARENT_INCREASE:
              this.props.at_addParent(res.data.content);
              break;
            case KEY_PARENT_DECREASE:
              this.props.at_subParent(res.data.content);
              break;
            default:
              break;
          }
        });
      }
    }
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container1);