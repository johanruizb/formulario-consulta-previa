import SEARCH_DOC from '../../hooks/request/search'

export async function onSubmit(e, options) {
    let text = "No se encontro el usuario"
    let success = false
    try {
         e.preventDefault()
         const value = e.target.elements[0].value 

         if (value?.length <= 9) return
         const user = await foundUser(value)
         const userJson = await user.json()
       
         if (userJson?.id) {
            text = "Usted esta registrado en la base de datos"
            success = true
         }

         options.setText(text)
         options.setOpen(true)
         options.setIsSucess(success)
         options.setOpenDialog(success)
         setTimeout(() => {
            options.setShowPreview(success)
         },3000)
    } catch(e) {
        console.log(e)
    }
}

export function handlerDialog(action, set) {
    set(action)
}

// Private Func

const foundUser = async (user) => {
    return await SEARCH_DOC.existUser(user)
}