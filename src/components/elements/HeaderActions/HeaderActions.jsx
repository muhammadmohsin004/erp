import { IoMdRefresh } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import FilledButton from "../buttons/filledButton/FilledButton";

const HeaderActions = ({
  refreshAction,
  addAction,
  addText,
  importText,
  importAction,
}) => {
  return (
    <div className="flex gap-x-3">
      <FilledButton
        isIcon={true}
        icon={IoMdRefresh}
        isIconLeft={true}
        isIconRight={false}
        iconSize={`text-lg`}
        bgColor={`bg-gray-300`}
        textColor={`text-gray-500`}
        buttonText={``}
        height={`h-[36px]`}
        width={`w-[36px]`}
        rounded={`rounded-md`}
        fontWeight={`font-semibold`}
        fontSize={`text-xs`}
        type={`button`}
        onClick={refreshAction}
      />
      {addText !== "" && (
        <FilledButton
          isIcon={true}
          icon={IoAddCircle}
          isIconLeft={true}
          isIconRight={false}
          iconSize={`text-lg`}
          bgColor={`bg-primary`}
          textColor={`text-white`}
          buttonText={addText}
          height={`h-[36px]`}
          width={`w-auto`}
          rounded={`rounded-md`}
          fontWeight={`font-semibold`}
          fontSize={`text-sm`}
          type={`button`}
          onClick={addAction}
          px="px-4"
        />
      )}

      {importText !== "" && (
        <FilledButton
          isIcon={true}
          icon={MdOutlineFileDownload}
          isIconLeft={true}
          isIconRight={false}
          iconSize={`text-lg`}
          bgColor={`bg-black`}
          textColor={`text-white`}
          buttonText={importText}
          height={`h-[36px]`}
          width={`w-auto`}
          rounded={`rounded-md`}
          fontWeight={`font-semibold`}
          fontSize={`text-sm`}
          type={`button`}
          onClick={importAction}
          px="px-4"
        />
      )}
    </div>
  );
};

export default HeaderActions;
