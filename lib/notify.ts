import { Notify } from "quasar";
import Swal from "sweetalert2";
type Position = "bottom" | "top" | "top-right" | "bottom-right" | "bottom-left";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export function NotifySuccess(message: string, position: Position = "bottom") {
  return Notify.create({
    message: message,
    icon: "check_success",
    color: "green-10",
    textColor: "white",
    iconColor: "white",
    position: position,
  });
}

export function NotifyError(message: string, position: Position = "bottom") {
  return Notify.create({
    message: message,
    icon: "error",
    color: "red-4",
    textColor: "white",
    iconColor: "red-10",
    position: position,
  });
}

export function NotifyToastSuccess(message: string) {
  Toast.fire({
    icon: "success",
    title: message,
    padding: "10px",
  });
}
