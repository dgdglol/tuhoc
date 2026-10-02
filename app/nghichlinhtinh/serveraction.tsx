"use server";
import {revalidatePath} from 'next/cache';

export type FormState ={
    success: boolean;
    message: string;
} | null
export async function addFeedback(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const name =FormData.get('name') as string
    const content= FormData.get('ccontent') as string

    await new Promise((resolve))=> setTimeout((resolve,1000))

    if(!name ||  name.trim().length < 2){
        return{
            success: false,
            message: 'Họ tên phải có ít nhất 2 ký tự',
        }
    }
    if(!content || content.trim().length<5){
        return{
            success: false,
            message: ' it nhat 5 tu dien',
        }
    }

    console.log('Luu vo DB',{name,content})

    revalidatePath('/')
    return{
        success: true,
        message: 'Cam on',
    }
}


