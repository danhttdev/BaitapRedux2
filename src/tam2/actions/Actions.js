import axios from "axios";

import {
    HOST,
    GET_DATA_FIRST,
    TOGGLE_PERMIT,
    CHANGE_VALUE,
    ADD_PARENT,
    SUB_PARENT,
    DELETE_CHILD
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