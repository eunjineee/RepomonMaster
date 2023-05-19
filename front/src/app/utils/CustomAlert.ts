import Swal from "sweetalert2";
import "@/styles/variables.scss";

export const customAlert = (text: string) => {
  Swal.fire({
    text,
    confirmButtonText: "확인",
    confirmButtonColor: "rgba(161, 205, 255, 1)",
  });
};
