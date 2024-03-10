import { useCallback } from 'react'

export default function useMsgSpinner(setMsg: any) {
    return useCallback((MsgStream: any) => {
        setMsg(MsgStream)
    }, [])
}
