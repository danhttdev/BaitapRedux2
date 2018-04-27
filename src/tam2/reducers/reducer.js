import {
    initialState,
    GET_DATA_FIRST,
    TOGGLE_PERMIT,
    CHANGE_VALUE,
    ADD_PARENT,
    SUB_PARENT,
    DELETE_CHILD
} from "../constants";

export function reducer(state = initialState, action) {
    switch (action.type) { 
        case GET_DATA_FIRST:
            return {
                ...state,
                counters: action.arr
            } 
        case TOGGLE_PERMIT:
            return {
                ...state,
                isPermit: !state.isPermit
            }
        case CHANGE_VALUE:
            const arr = state.counters.map((item) => {
                if (item.id === action.id) item.value = action.value;
                return item;
            })
            return {
                ...state,
                counters: [...arr]
            }
        case ADD_PARENT:
            return {
                ...state,
                counters: [...state.counters.concat(action.arr)]
            }
        case SUB_PARENT:
            const arr2 = [...state.counters];
            const result = arr2.filter((item) => {
                if (action.arr.includes(item.id)) return false;
                return true;
            })
            return {
                ...state,
                counters: [...result]
            }
        case DELETE_CHILD:
            return {
                ...state,
                counters: state.counters.filter((item) => {
                    if (item.id === action.id) return false;
                    return true;
                })
            }
        default:
        return state;
    }
}
