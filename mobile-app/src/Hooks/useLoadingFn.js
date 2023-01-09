import { useContext } from "react"
import { Alert } from "react-native"
import { AppContext } from "../Providers/AppProvider"

export default useLoadingFn = (fn, { showLoading = true, loadingText = 'Loading' } = {}) => {

    const { setLoading } = useContext(AppContext)

    const loadingFunction = async ({ params, onSuccess, onFail }) => {
        setLoading(loadingText)
        try {
            const res = await fn(params)
            if (onSuccess) onSuccess(res)
        } catch (error) {
            console.log(error, JSON.stringify(error.message, null, 2))
            if (onFail) onFail(error)
            Alert.alert('Error', error.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return loadingFunction
}