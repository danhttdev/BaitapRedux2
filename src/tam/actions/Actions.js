import {
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

// export function fetchData() {
//     return (dispatch) => {
//       dispatch()
//       getPeople()
//         .then((data) => {
//           dispatch(getDataSuccess(data))
//         })
//         .catch((err) => console.log('err:', err))
//     }
//   }