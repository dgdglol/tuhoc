'use server'
import {useRef, useActionState, useEffect} from 'react'
import { addFeedback, type FormState } from './serveraction'
export default function feedbackForm() {
    const formRef = useRef<HTMLFormElement>(null)

    const [state, formAction, isPending ] = useActionState(addFeedback, null)
    //useActionState dung de 
}