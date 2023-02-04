

import { toast, Zoom } from "react-toastify"

function toastError(text) {
   return toast.error(text, {
      autoClose: 2500,
      transition: Zoom,
      pauseOnHover: 'false'
   })
}

function toastSuccess(text) {
   return toast.success(text, {
      autoClose: 1500,
      transition: Zoom,
      pauseOnHover: 'false'
   })
}

function regexEmail(email, text) {
   // eslint-disable-next-line
   let regex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

   if (!regex.test(email)) return toastError(text)
}

function setQuality(file) {
   if (file.size < 200000) return .01
   if (file.size < 300000) return .09
   if (file.size < 500000) return .08
   if (file.size < 750000) return .075
   if (file.size < 900000) return .07
   if (file.size < 1100000) return .065
   if (file.size < 1400000) return .060
   if (file.size < 1700000) return .055
   if (file.size < 2000000) return .05
   if (file.size < 2500000) return .04
   if (file.size < 3000000) return .03
   if (file.size < 4000000) return .02
   if (file.size < 5000000) return .018
   if (file.size < 6000000) return .015
   if (file.size < 7000000) return .014
   if (file.size < 8000000) return .013
   if (file.size < 9000000) return .012
   if (file.size < 10000000) return .011
   if (file.size > 10000000) return .01
}

function convertBase64(file) {
   return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
         resolve(fileReader.result)
      }
      fileReader.onerror = () => {
         reject(fileReader.error)
      }
   })
}

function uploadPhoto(image) {
   const formData = new FormData()
   formData.append('file', image)
   formData.append('upload_preset', 'Veneron')
   formData.append('cloud_name', 'dkndvpxs7')

   fetch('https://api.cloudinary.com/v1_1/dkndvpxs7/image/upload', {
      method: 'post',
      body: formData
   }).then(result => result.json()).then(data => {
      console.log(data.imgUrl);
   }).catch(ex => console.log(ex))
}

function numberWithCommas(x) {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export { toastError, toastSuccess, regexEmail, setQuality, convertBase64, uploadPhoto, numberWithCommas }