// enum AlertType {
//     Success = "success",
//     Info = "info",
//     Alert = "warning",
//     Danger = "danger",
// }

interface Alert {
    id?: number
    type?: string
    title?: string
    body: string
    dismissible?: boolean
}

export default Alert;