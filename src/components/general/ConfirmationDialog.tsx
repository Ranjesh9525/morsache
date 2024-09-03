import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from '../ui/button';

type Props = {
    openDialog:boolean;
    setOpenDialog:React.Dispatch<React.SetStateAction<boolean>>
    dialogTitle:string;
    onClose?:()=> void;
    onClick : ()=>void;
    onClickBtnTitle?:string;
}

const ConfirmationDialog = ({openDialog,setOpenDialog,dialogTitle,onClose,onClick,onClickBtnTitle}: Props) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
    <DialogContent className="items-center z-[110] w-fit">
      <DialogHeader>
        <DialogTitle>      
          <h1> {dialogTitle}</h1>
        </DialogTitle>
      </DialogHeader>
      <div className="flex gap-6 items-center justify-center w-full">
        <Button
          type="button"
          variant={"outline"}
          onClick={() => onClose ? onClose() :  setOpenDialog(false)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant={"destructive"}
          // onClick={handleDeleteImage}
              onClick={onClick}

        >
         {onClickBtnTitle || "Delete"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
  )
}

export default ConfirmationDialog