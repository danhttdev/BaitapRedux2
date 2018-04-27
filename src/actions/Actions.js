import axios from "axios";

import {
    HOST,
    GET_DATA_FIRST,
    TOGGLE_PERMIT,
    CHANGE_VALUE,
    ADD_PARENT,
    SUB_PARENT,
    DELETE_CHILD,
    KEY_PARENT_DECREASE,
    KEY_PARENT_INCREASE,
    KEY_UPDATE_CHILD,
    KEY_DELETE_CHILD
} from ".././constants";

export function at_getData(arr) {
    return {
        type: GET_DATA_FIRST,
        arr
    }
}
export function at_togglePermit(){
    return {
        type: TOGGLE_PERMIT,
    }
}
export function at_changeValue(id,value){
    return {
        type: CHANGE_VALUE,
        id,
        value
    }
}
export function at_addParent(arr){
    return {
        type: ADD_PARENT,
        arr
    }
}
export function at_subParent(arr){
    return {
        type: SUB_PARENT,
        arr
    }
}
export function at_deleteChild(id) {
    return {
        type: DELETE_CHILD,
        id
    }
}

export function atx_fetchData(isPermit) {
    return (dispatch) => {
      if (isPermit) {
        dispatch(at_togglePermit());
        let link = `${HOST}`;
        axios.get(link)
          .then((res) => {
            dispatch(at_togglePermit());
            dispatch(at_getData(res.data));
        }).catch((err) => console.log('err:', err))
      }
    }
}

export function atx_deleteChild(id, role, isPermit) {
    return (dispatch) => {
        if (isPermit) {
            dispatch(at_togglePermit());
            const link = `${HOST}?id=${id}&role=${role}`;
            axios.delete(link)
            .then((res)=> {
              dispatch(at_togglePermit());
              dispatch(at_changeValue(res.data.id,parseInt(res.data.value,10)));
              dispatch(at_subParent(res.data.content));
            });
        }
    }
}

export function atx_blur(id, role, oldValue, newValue) {
    return (dispatch, getStore) => {
        if (getStore().isPermit && newValue !== oldValue) {
            let link = `${HOST}`;
            let info = {id:id,role:role,oldValue:oldValue,newValue:newValue};
            dispatch(at_togglePermit());
            axios.post(link,info)
            .then((res) => {
                dispatch(at_togglePermit());
                dispatch(at_changeValue(res.data.id,parseInt(res.data.value,10)));
                switch (res.data.key){
                    case KEY_UPDATE_CHILD:
                        break;
                    case KEY_PARENT_INCREASE:
                        dispatch(at_addParent(res.data.content));
                        break;
                    case KEY_PARENT_DECREASE:
                        let dem = 0;
                        const listIdDeleted = getStore().counters.reverse().filter((item, index) => {
                            if (item.role === 1) dem = 1;
                            return index < Math.abs(newValue - oldValue) + dem;
                        }).map(item => item.id);
                        dispatch(at_subParent(listIdDeleted));
                        break;
                    default: break;
                }
            });
            
        }
    }
}

export function atx_click(id, isUp, role, value, isPermit) {
    return (dispatch) => {
        if (isPermit) {
            dispatch(at_togglePermit());
            const oldValue= value;
            let link = `${HOST}`;
            const newValue = isUp?oldValue+1:oldValue-1;
            let info = {
              id,
              role,
              oldValue,
              newValue
            };
            if (oldValue === 0 && !isUp){
                dispatch(at_togglePermit());
            } else {
              axios.post(link,info)
              .then((res) => {
                dispatch(at_togglePermit());
                dispatch(at_changeValue(res.data.id,parseInt(res.data.value,10)));
                switch (res.data.key){
                  case KEY_UPDATE_CHILD:
                    break;
                  case KEY_PARENT_INCREASE:
                    dispatch(at_addParent(res.data.content));
                    break;
                  case KEY_PARENT_DECREASE:
                    dispatch(at_subParent(res.data.content));
                    break;
                  default:
                    break;
                }
              });
            }
          }
        
    }
    
}