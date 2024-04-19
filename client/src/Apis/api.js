import { useState } from "react";
import axios from "axios";

export const useGetApiCaller = (URL) => {

    const [state, setState] = useState({
        data : null,
        isError : null,
        isLoading : null,
    })
    
    const fetchApi = async (headers) => {
        try {
            setState({
                data : null,
                isError : null,
                isLoading : true
            })
            console.log(headers)
            const response = await axios.get(URL, (headers ? headers : null));
            setState({
                data : response.data,
                isError : false,
                isLoading : false
            })
        } catch (error) {
            setState({
                data : error.response,
                isError : true,
                isLoading : false
            })
            console.log("Error in fetching data from the server", error);
        }
    }

    return {...state, fetchApi : fetchApi};

}

export const usePostApiCaller = (URL) => {
    const [state, setState] = useState({
        data : null,
        isError : null,
        isLoading : null,
    });

    const postData = async (data, headers) => {
        try {
            setState({
                data : null,
                isError : null,
                isLoading : true
            })
            const response = await axios.post(URL, data, headers);
            setState({
                data : response.data,
                isError : false,
                isLoading : false
            })
        } catch (error) {
            setState({
                data : null,
                isError : true,
                isLoading : false
            })
            console.log("Error in posting data to the server", error);
        }
    }

    return {...state, postData : postData};
}

export const usePutApiCaller = (URL) => {
    const [state, setState] = useState({
        data : null,
        isError : null,
        isLoading : null,
    });

    const updateData = async (data, headers) => {
        try {
            setState({
                data : null,
                isError : null,
                isLoading : true
            })
            const response = await axios.put(URL, data, headers);
            setState({
                data : response.data,
                isError : false,
                isLoading : false
            })
        } catch (error) {
            setState({
                data : null,
                isError : true,
                isLoading : false
            })
            console.log("Error in posting data to the server", error);
        }
    }

    return {...state, updateData : updateData};
}