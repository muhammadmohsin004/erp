// import React, { useState } from "react";
// import { FaTrash, FaPlusCircle } from "react-icons/fa";
// import { IoEyeOutline } from "react-icons/io5";
// import BodyHeader from "../../../components/elements/bodyHeader/BodyHeader";
// import Tabs from "../../../components/elements/tabs/Tabs";
// import Container from "../../../components/elements/container/Container";
// import Alert from "../../../components/elements/alert/Alert";
// import Card from "../../../components/elements/card/Card";
// import InputField from "../../../components/elements/inputField/InputField";
// import SelectBox from "../../../components/elements/selectBox/SelectBox";
// import FilledButton from "../../../components/elements/elements/buttons/filledButton/FilledButton";
// import OutlineButton from "../../../components/elements/elements/buttons/OutlineButton/OutlineButton";
// import Table from "../../../components/elements/table/Table";
// import Thead from "../../../components/elements/thead/Thead";
// import Tbody from "../../../components/elements/tbody/Tbody";
// import TH from "../../../components/elements/th/TH";
// import TR from "../../../components/elements/tr/TR";
// import TD from "../../../components/elements/td/TD";
// import Modall from "../../../components/elements/modal/Modal";
// import { useSuperAdmin } from "../../../Contexts/superAdminApiClient/superAdminApiClient";
// import Dropdown from "../../../components/elements/dropdown/Dropdown";
// import CheckboxField from "../../../components/elements/checkbox/CheckboxField";
// import { translations } from "../../../translations/CreateInvoicetranslation";

// // Sub-component for Client Details
// const ClientDetails = ({ clientData, setClientData, validateForm, t }) => {
//   const [showAdvancedModal, setShowAdvancedModal] = useState(false);

//   const handleAdvancedFieldChange = (field, value) => {
//     setClientData({ ...clientData, [field]: value });
//   };

//   const clientTypeOptions = [
//     { label: t.individual, value: "Individual" },
//     { label: t.business, value: "Business" },
//   ];

//   const countryOptions = [
//     { label: t.selectCountry, value: "" },
//     { label: t.unitedStates, value: "USA" },
//     { label: t.canada, value: "Canada" },
//     { label: t.unitedKingdom, value: "UK" },
//     { label: t.australia, value: "Australia" },
//     { label: t.india, value: "India" },
//     { label: t.pakistan, value: "Pakistan" },
//   ];

//   const invoicingMethodOptions = [
//     { label: t.printOffline, value: "Print (Offline)" },
//     { label: t.emailMethod, value: "Email" },
//     { label: t.onlinePortal, value: "Online Portal" },
//   ];

//   const currencyOptions = [
//     { label: t.pkrPakistaniRupee, value: "PKR" },
//     { label: t.usdUnitedStatesDollar, value: "USD" },
//     { label: t.eurEuro, value: "EUR" },
//   ];

//   const languageOptions = [
//     { label: t.selectLanguage, value: "" },
//     { label: t.english, value: "English" },
//     { label: t.urdu, value: "Urdu" },
//     { label: t.spanish, value: "Spanish" },
//   ];

//   const priceGroupOptions = [
//     { label: t.selectPriceGroup, value: "" },
//     { label: t.standard, value: "Standard" },
//     { label: t.premium, value: "Premium" },
//     { label: t.discounted, value: "Discounted" },
//   ];

//   const accountOptions = [
//     { label: t.selectAccount, value: "" },
//     { label: t.sales, value: "Sales" },
//     { label: t.miscellaneous, value: "Miscellaneous" },
//     { label: t.default, value: "Default" },
//   ];

//   return (
//     <div className="space-y-4">
//       <h5 className="text-lg font-bold">{t.clientDetails}</h5>
//       <SelectBox
//         label={t.clientType}
//         name="clientType"
//         value={clientData.clientType}
//         optionList={clientTypeOptions}
//         handleChange={(value) =>
//           setClientData({ ...clientData, clientType: value })
//         }
//         width="w-full"
//       />
//       <InputField
//         label={`${t.businessName} *`}
//         name="businessName"
//         placeholder={t.enterBusinessName}
//         value={clientData.businessName}
//         onChange={(e) =>
//           setClientData({ ...clientData, businessName: e.target.value })
//         }
//         errors={
//           validateForm && !clientData.businessName
//             ? { businessName: { message: t.businessNameRequired } }
//             : {}
//         }
//       />
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <InputField
//           label={t.firstName}
//           name="firstName"
//           value={clientData.firstName}
//           onChange={(e) =>
//             setClientData({ ...clientData, firstName: e.target.value })
//           }
//         />
//         <InputField
//           label={t.lastName}
//           name="lastName"
//           value={clientData.lastName}
//           onChange={(e) =>
//             setClientData({ ...clientData, lastName: e.target.value })
//           }
//         />
//       </div>
//       <InputField
//         label={t.email}
//         name="email"
//         type="email"
//         placeholder={t.enterEmail}
//         value={clientData.email}
//         onChange={(e) =>
//           setClientData({ ...clientData, email: e.target.value })
//         }
//       />
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <InputField
//           label={t.streetAddress}
//           name="streetAddress"
//           value={clientData.streetAddress}
//           onChange={(e) =>
//             setClientData({ ...clientData, streetAddress: e.target.value })
//           }
//         />
//         <InputField
//           label={t.addressLine2}
//           name="addressLine2"
//           value={clientData.addressLine2}
//           onChange={(e) =>
//             setClientData({ ...clientData, addressLine2: e.target.value })
//           }
//         />
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <InputField
//           label={t.city}
//           name="city"
//           value={clientData.city}
//           onChange={(e) =>
//             setClientData({ ...clientData, city: e.target.value })
//           }
//         />
//         <InputField
//           label={t.state}
//           name="state"
//           value={clientData.state}
//           onChange={(e) =>
//             setClientData({ ...clientData, state: e.target.value })
//           }
//         />
//         <InputField
//           label={t.zipCode}
//           name="zipCode"
//           value={clientData.zipCode}
//           onChange={(e) =>
//             setClientData({ ...clientData, zipCode: e.target.value })
//           }
//         />
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <InputField
//           label={t.telephone}
//           name="telephone"
//           value={clientData.telephone}
//           onChange={(e) =>
//             setClientData({ ...clientData, telephone: e.target.value })
//           }
//         />
//         <InputField
//           label={t.mobile}
//           name="mobile"
//           value={clientData.mobile}
//           onChange={(e) =>
//             setClientData({ ...clientData, mobile: e.target.value })
//           }
//         />
//       </div>
//       <SelectBox
//         label={t.country}
//         name="country"
//         value={clientData.country}
//         optionList={countryOptions}
//         handleChange={(value) =>
//           setClientData({ ...clientData, country: value })
//         }
//         width="w-full"
//       />
//       <div className="flex items-center justify-between">
//         <CheckboxField
//           name="addShippingAddress"
//           label={t.addShippingAddress}
//           checked={clientData?.addShippingAddress || false}
//           onChange={(e) =>
//             setClientData({
//               ...clientData,
//               addShippingAddress: e.target.checked,
//             })
//           }
//         />
//         <OutlineButton
//           buttonText={t.advanced}
//           wing
//           textColor="text-blue-600"
//           borderColor="border-blue-600"
//           hover="hover:bg-blue-50"
//           onClick={() => setShowAdvancedModal(true)}
//         />
//       </div>
//       <div className="flex justify-end gap-2">
//         <OutlineButton
//           buttonText={t.cancel}
//           textColor="text-gray-600"
//           borderColor="border-gray-600"
//           hover="hover:bg-gray-50"
//         />
//         <FilledButton buttonText={t.saveClient} bgColor="bg-blue-600" />
//       </div>

//       <Modall
//         title={t.advancedClientDetails}
//         modalOpen={showAdvancedModal}
//         setModalOpen={setShowAdvancedModal}
//         okText={t.saveChanges}
//         cancelText={t.close}
//         okAction={() => setShowAdvancedModal(false)}
//         cancelAction={() => setShowAdvancedModal(false)}
//         width={800}
//         body={
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <InputField
//                 label={`${t.fullName} *`}
//                 name="fullName"
//                 placeholder={t.enterFullName}
//                 value={clientData.fullName || ""}
//                 onChange={(e) =>
//                   handleAdvancedFieldChange("fullName", e.target.value)
//                 }
//                 errors={
//                   validateForm && !clientData.fullName
//                     ? { fullName: { message: t.fullNameRequired } }
//                     : {}
//                 }
//               />
//               <InputField
//                 label={`${t.codeNumber} *`}
//                 name="codeNumber"
//                 placeholder={t.enterCodeNumber}
//                 value={clientData.codeNumber || "000001"}
//                 onChange={(e) =>
//                   handleAdvancedFieldChange("codeNumber", e.target.value)
//                 }
//                 errors={
//                   validateForm && !clientData.codeNumber
//                     ? { codeNumber: { message: t.codeNumberRequired } }
//                     : {}
//                 }
//               />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <SelectBox
//                 label={t.invoicingMethod}
//                 name="invoicingMethod"
//                 value={clientData.invoicingMethod || "Print (Offline)"}
//                 optionList={invoicingMethodOptions}
//                 handleChange={(value) =>
//                   handleAdvancedFieldChange("invoicingMethod", value)
//                 }
//                 width="w-full"
//               />
//               <SelectBox
//                 label={t.currency}
//                 name="currency"
//                 value={clientData.currency || "PKR"}
//                 optionList={currencyOptions}
//                 handleChange={(value) =>
//                   handleAdvancedFieldChange("currency", value)
//                 }
//                 width="w-full"
//               />
//             </div>
//             <InputField
//               label={t.category}
//               name="category"
//               placeholder={t.enterCategory}
//               value={clientData.category || ""}
//               onChange={(e) =>
//                 handleAdvancedFieldChange("category", e.target.value)
//               }
//             />
//             <InputField
//               label={t.notes}
//               name="notes"
//               type="textarea"
//               placeholder={t.enterNotes}
//               value={clientData.notes || ""}
//               onChange={(e) =>
//                 handleAdvancedFieldChange("notes", e.target.value)
//               }
//             />
//             <InputField
//               label={t.attachments}
//               name="attachments"
//               type="file"
//               onChange={(e) =>
//                 handleAdvancedFieldChange(
//                   "attachments",
//                   Array.from(e.target.files)
//                 )
//               }
//             />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <SelectBox
//                 label={t.displayLanguage}
//                 name="displayLanguage"
//                 value={clientData.displayLanguage || ""}
//                 optionList={languageOptions}
//                 handleChange={(value) =>
//                   handleAdvancedFieldChange("displayLanguage", value)
//                 }
//                 width="w-full"
//               />
//               <SelectBox
//                 label={t.priceGroup}
//                 name="priceGroup"
//                 value={clientData.priceGroup || ""}
//                 optionList={priceGroupOptions}
//                 handleChange={(value) =>
//                   handleAdvancedFieldChange("priceGroup", value)
//                 }
//                 width="w-full"
//               />
//             </div>
//             <SelectBox
//               label={t.account}
//               name="account"
//               value={clientData.account || ""}
//               optionList={accountOptions}
//               handleChange={(value) =>
//                 handleAdvancedFieldChange("account", value)
//               }
//               width="w-full"
//             />
//             <InputField
//               label={t.itemTags}
//               name="itemTags"
//               placeholder={t.itemTagsPlaceholder}
//               value={clientData.itemTags || ""}
//               onChange={(e) =>
//                 handleAdvancedFieldChange("itemTags", e.target.value)
//               }
//             />
//             <CheckboxField
//               name="addSecondaryAddress"
//               label={t.addSecondaryAddress}
//               checked={clientData.addSecondaryAddress || false}
//               onChange={(e) =>
//                 handleAdvancedFieldChange(
//                   "addSecondaryAddress",
//                   e.target.checked
//                 )
//               }
//             />
//             <InputField
//               label={t.contactsList}
//               name="contactsList"
//               type="textarea"
//               placeholder={t.contactsListPlaceholder}
//               value={clientData.contactsList || ""}
//               onChange={(e) =>
//                 handleAdvancedFieldChange("contactsList", e.target.value)
//               }
//             />
//           </div>
//         }
//       />
//     </div>
//   );
// };

// // Sub-component for Estimate Info
// const EstimateInfo = ({ estimateData, setEstimateData, t }) => (
//   <div className="space-y-4">
//     <h5 className="text-lg font-bold">{t.estimateInfo}</h5>
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
//       <span className="font-medium">{t.estimateNumber}</span>
//       <InputField
//         name="estimateNumber"
//         value={estimateData.estimateNumber}
//         disabled
//       />
//     </div>
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
//       <span className="font-medium">{t.estimateDate}</span>
//       <InputField
//         name="estimateDate"
//         type="date"
//         value={estimateData.estimateDate}
//         onChange={(e) =>
//           setEstimateData({ ...estimateData, estimateDate: e.target.value })
//         }
//       />
//     </div>
//   </div>
// );

// // Sub-component for Items Table
// const ItemsTable = ({
//   items,
//   handleItemChange,
//   handleAddRow,
//   handleRemoveRow,
//   total,
//   itemsTotal,
//   t,
// }) => (
//   <Card className="p-4 bg-gray-50">
//     <div className="overflow-x-auto">
//       <Table>
//         <Thead>
//           <TR>
//             <TH>{t.items}</TH>
//             <TH>{t.unitPrice}</TH>
//             <TH>{t.qty}</TH>
//             <TH>{t.stockOnHand}</TH>
//             <TH>{t.newStockOnHand}</TH>
//             <TH>{t.total}</TH>
//             <TH />
//           </TR>
//         </Thead>
//         <Tbody>
//           {items.map((item, idx) => (
//             <TR key={item.id}>
//               <TD>
//                 <InputField
//                   name={`item-${idx}`}
//                   placeholder={t.itemPlaceholder}
//                   value={item.item}
//                   onChange={(e) =>
//                     handleItemChange(idx, "item", e.target.value)
//                   }
//                 />
//               </TD>
//               <TD>
//                 <InputField
//                   name={`unitPrice-${idx}`}
//                   type="number"
//                   value={item.unitPrice}
//                   onChange={(e) =>
//                     handleItemChange(idx, "unitPrice", e.target.value)
//                   }
//                   className="bg-yellow-50"
//                 />
//               </TD>
//               <TD>
//                 <InputField
//                   name={`qty-${idx}`}
//                   type="number"
//                   value={item.qty}
//                   onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
//                   className="bg-yellow-50"
//                 />
//               </TD>
//               <TD>{item.stockOnHand.toFixed(2)}</TD>
//               <TD>{item.newStock.toFixed(2)}</TD>
//               <TD>${total(item)}</TD>
//               <TD>
//                 <OutlineButton
//                   isIcon
//                   icon={FaTrash}
//                   textColor="text-red-600"
//                   borderColor="border-red-600"
//                   hover="hover:bg-red-50"
//                   onClick={() => handleRemoveRow(idx)}
//                 />
//               </TD>
//             </TR>
//           ))}
//           <TR>
//             <TD colSpan={7} className="text-center">
//               <FilledButton
//                 isIcon
//                 icon={FaPlusCircle}
//                 buttonText={t.addItem}
//                 bgColor="bg-blue-600"
//                 isIconLeft
//                 onClick={handleAddRow}
//               />
//             </TD>
//           </TR>
//         </Tbody>
//       </Table>
//     </div>
//     <div className="flex justify-end mt-2">
//       <span className="font-medium mr-2">{t.itemsTotal}:</span> $
//       {itemsTotal.toFixed(2)}
//     </div>
//   </Card>
// );

// // Sub-component for Discount & Adjustment Tab
// const DiscountAdjustmentTab = ({
//   discountValue,
//   setDiscountValue,
//   discountType,
//   setDiscountType,
//   adjustment,
//   setAdjustment,
//   account,
//   setAccount,
//   t,
// }) => {
//   const discountTypeOptions = [
//     { label: t.percentage, value: "%" },
//     { label: t.flat, value: "$" },
//   ];

//   const accountOptions = [
//     { label: t.defaultAccount, value: "Default Account" },
//     { label: t.sales, value: "Sales" },
//     { label: t.miscellaneous, value: "Miscellaneous" },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
//       <div>
//         <span className="block mb-1 font-medium">{t.discount}</span>
//         <div className="flex gap-2">
//           <InputField
//             name="discountValue"
//             type="number"
//             value={discountValue}
//             onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
//           />
//           <SelectBox
//             name="discountType"
//             value={discountType}
//             optionList={discountTypeOptions}
//             handleChange={(value) => setDiscountType(value)}
//             width="w-full"
//           />
//         </div>
//       </div>
//       <InputField
//         label={t.adjustment}
//         name="adjustment"
//         type="number"
//         value={adjustment}
//         onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
//       />
//       <SelectBox
//         label={t.account}
//         name="account"
//         value={account}
//         optionList={accountOptions}
//         handleChange={(value) => setAccount(value)}
//         width="w-full"
//       />
//     </div>
//   );
// };

// // Sub-component for Shipping Details Tab
// const ShippingDetailsTab = ({
//   shippingInstructions,
//   setShippingInstructions,
//   t,
// }) => (
//   <div className="p-4">
//     <InputField
//       label={t.shippingInstructions}
//       name="shippingInstructions"
//       type="textarea"
//       placeholder={t.enterShippingInstructions}
//       value={shippingInstructions}
//       onChange={(e) => setShippingInstructions(e.target.value)}
//     />
//   </div>
// );

// // Sub-component for Attach Documents Tab
// const AttachDocumentsTab = ({ setFiles, t }) => (
//   <div className="p-4">
//     <InputField
//       label={t.uploadFiles}
//       name="files"
//       type="file"
//       onChange={(e) => setFiles(e.target.files)}
//     />
//   </div>
// );

// // Sub-component for Preview Modal
// const PreviewModal = ({
//   show,
//   handleClose,
//   estimateData,
//   clientData,
//   items,
//   discountValue,
//   discountType,
//   adjustment,
//   account,
//   noteTerms,
//   shippingInstructions,
//   total,
//   itemsTotal,
//   t,
// }) => {
//   const finalTotal =
//     discountType === "%"
//       ? itemsTotal * (1 - discountValue / 100) + adjustment
//       : itemsTotal - discountValue + adjustment;

//   return (
//     <Modall
//       title={t.estimatePreview}
//       modalOpen={show}
//       setModalOpen={handleClose}
//       okText={t.close}
//       cancelText=""
//       okAction={handleClose}
//       width={800}
//       body={
//         <div className="space-y-4">
//           <h5 className="text-lg font-bold">{t.clientDetailsPreview}</h5>
//           <p>
//             <strong>{t.businessName}:</strong> {clientData.businessName || t.na}
//           </p>
//           <p>
//             <strong>{t.fullName}:</strong> {clientData.fullName || t.na}
//           </p>
//           <p>
//             <strong>{t.firstName} {t.lastName}:</strong> {clientData.firstName} {clientData.lastName}
//           </p>
//           <p>
//             <strong>{t.email}:</strong> {clientData.email || t.na}
//           </p>
//           <p>
//             <strong>{t.streetAddress}:</strong> {clientData.streetAddress},{" "}
//             {clientData.city}, {clientData.state} {clientData.zipCode},{" "}
//             {clientData.country}
//           </p>
//           <p>
//             <strong>{t.telephone}:</strong> {clientData.telephone || t.na}
//           </p>
//           <p>
//             <strong>{t.mobile}:</strong> {clientData.mobile || t.na}
//           </p>
//           <p>
//             <strong>{t.codeNumber}:</strong> {clientData.codeNumber || t.na}
//           </p>
//           <p>
//             <strong>{t.invoicingMethod}:</strong>{" "}
//             {clientData.invoicingMethod || t.na}
//           </p>
//           <p>
//             <strong>{t.currency}:</strong> {clientData.currency || t.na}
//           </p>
//           <p>
//             <strong>{t.category}:</strong> {clientData.category || t.na}
//           </p>
//           <p>
//             <strong>{t.notes}:</strong> {clientData.notes || t.na}
//           </p>
//           <p>
//             <strong>{t.attachments}:</strong>{" "}
//             {clientData.attachments?.length
//               ? clientData.attachments.map((file) => file.name).join(", ")
//               : t.na}
//           </p>
//           <p>
//             <strong>{t.displayLanguage}:</strong>{" "}
//             {clientData.displayLanguage || t.na}
//           </p>
//           <p>
//             <strong>{t.priceGroup}:</strong> {clientData.priceGroup || t.na}
//           </p>
//           <p>
//             <strong>{t.account}:</strong> {clientData.account || t.na}
//           </p>
//           <p>
//             <strong>{t.itemTags}:</strong> {clientData.itemTags || t.na}
//           </p>
//           <p>
//             <strong>{t.addSecondaryAddress}:</strong>{" "}
//             {clientData.addSecondaryAddress ? t.yes : t.no}
//           </p>
//           <p>
//             <strong>{t.contactsList}:</strong> {clientData.contactsList || t.na}
//           </p>
//           <hr />
//           <h5 className="text-lg font-bold">{t.estimateDetails}</h5>
//           <p>
//             <strong>{t.estimateNumber}:</strong> {estimateData.estimateNumber}
//           </p>
//           <p>
//             <strong>{t.estimateDate}:</strong> {estimateData.estimateDate}
//           </p>
//           <hr />
//           <h5 className="text-lg font-bold">{t.items}</h5>
//           <Table>
//             <Thead>
//               <TR>
//                 <TH>{t.item}</TH>
//                 <TH>{t.unitPrice}</TH>
//                 <TH>{t.qty}</TH>
//                 <TH>{t.total}</TH>
//               </TR>
//             </Thead>
//             <Tbody>
//               {items.map((item) => (
//                 <TR key={item.id}>
//                   <TD>{item.item || t.na}</TD>
//                   <TD>${item.unitPrice.toFixed(2)}</TD>
//                   <TD>{item.qty}</TD>
//                   <TD>${total(item)}</TD>
//                 </TR>
//               ))}
//             </Tbody>
//           </Table>
//           <p>
//             <strong>{t.itemsTotal}:</strong> ${itemsTotal.toFixed(2)}
//           </p>
//           <p>
//             <strong>{t.discount} ({discountType}):</strong>{" "}
//             {discountType === "%" ? `${discountValue}%` : `$${discountValue}`}
//           </p>
//           <p>
//             <strong>{t.adjustment}:</strong> ${adjustment.toFixed(2)}
//           </p>
//           <p>
//             <strong>{t.finalTotal}:</strong> ${finalTotal.toFixed(2)}
//           </p>
//           <p>
//             <strong>{t.account}:</strong> {account}
//           </p>
//           <hr />
//           <h5 className="text-lg font-bold">{t.shippingInstructions}</h5>
//           <p>{shippingInstructions || t.na}</p>
//           <hr />
//           <h5 className="text-lg font-bold">{t.notesTerms}</h5>
//           <div dangerouslySetInnerHTML={{ __html: noteTerms || t.na }} />
//         </div>
//       }
//     />
//   );
// };

// // Main Component
// const CreateInvoice = ({ onBack }) => {
//   const { createCompany, error, isLoading } = useSuperAdmin();
//   const [currentLanguage, setCurrentLanguage] = useState("en"); // Language state
//   const [noteTerms, setNoteTerms] = useState("");
//   const [activeTab, setActiveTab] = useState("discount");
//   const [discountType, setDiscountType] = useState("%");
//   const [discountValue, setDiscountValue] = useState(0);
//   const [adjustment, setAdjustment] = useState(0);
//   const [account, setAccount] = useState("Default Account");
//   const [items, setItems] = useState([
//     {
//       id: 1,
//       item: "",
//       unitPrice: 0,
//       qty: 1,
//       stockOnHand: 100,
//       newStock: 99,
//     },
//   ]);
//   const [clientData, setClientData] = useState({
//     clientType: "Individual",
//     businessName: "",
//     firstName: "",
//     lastName: "",
//     fullName: "",
//     email: "",
//     streetAddress: "",
//     addressLine2: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     telephone: "",
//     mobile: "",
//     country: "",
//     addShippingAddress: false,
//     addSecondaryAddress: false,
//     contactsList: "",
//     codeNumber: "000001",
//     invoicingMethod: "Print (Offline)",
//     currency: "PKR",
//     category: "",
//     notes: "",
//     attachments: [],
//     displayLanguage: "",
//     priceGroup: "",
//     account: "",
//     itemTags: "",
//   });
//   const [estimateData, setEstimateData] = useState({
//     estimateNumber: "000001",
//     estimateDate: "2025-05-13",
//   });
//   const [shippingInstructions, setShippingInstructions] = useState("");
//   const [files, setFiles] = useState([]);
//   const [showPreview, setShowPreview] = useState(false);
//   const [showError, setShowError] = useState(false);

//   // Get current translations
//   const t = translations[currentLanguage];

//   // Language switcher options
//   const languageSwitcherOptions = [
//     { label: "English", value: "en" },
//     { label: "عربي", value: "ar" },
//   ];

//   // Handler functions for table
//   const handleAddRow = () => {
//     setItems([
//       ...items,
//       {
//         id: items.length + 1,
//         item: "",
//         unitPrice: 0,
//         qty: 1,
//         stockOnHand: 100,
//         newStock: 99,
//       },
//     ]);
//   };

//   const handleRemoveRow = (idx) => {
//     setItems(items.filter((_, index) => index !== idx));
//   };

//   const handleItemChange = (idx, field, value) => {
//     setItems(
//       items.map((item, index) =>
//         index === idx
//           ? {
//               ...item,
//               [field]: field === "item" ? value : parseFloat(value) || 0,
//               newStock:
//                 field === "qty"
//                   ? item.stockOnHand - (parseFloat(value) || 0)
//                   : item.newStock,
//             }
//           : item
//       )
//     );
//   };

//   const total = (item) => (item.unitPrice * item.qty).toFixed(2);

//   const itemsTotal = items.reduce(
//     (sum, item) => sum + item.unitPrice * item.qty,
//     0
//   );

//   // Button Handlers
//   const handlePreview = () => {
//     setShowPreview(true);
//   };

//   const handleSaveAsDraft = async () => {
//     try {
//       const estimate = {
//         clientData,
//         estimateData,
//         items,
//         discountType,
//         discountValue,
//         adjustment,
//         account,
//         shippingInstructions,
//         noteTerms,
//         files: Array.from(files).map((file) => file.name),
//       };
//       localStorage.setItem("draftEstimate", JSON.stringify(estimate));
//       alert("Estimate saved as draft!");
//     } catch (error) {
//       setShowError(true);
//     }
//   };

//   const handleSaveAndPrint = async () => {
//     if (
//       !clientData.businessName ||
//       items.every((item) => !item.item) ||
//       !clientData.fullName ||
//       !clientData.codeNumber
//     ) {
//       setShowError(true);
//       return;
//     }

//     try {
//       // Assuming createCompany API can be adapted to save client data
//       await createCompany({
//         name: clientData.businessName,
//         email: clientData.email,
//         address: {
//           street: clientData.streetAddress,
//           city: clientData.city,
//           state: clientData.state,
//           zipCode: clientData.zipCode,
//           country: clientData.country,
//         },
//         phone: clientData.telephone,
//         mobile: clientData.mobile,
//         additionalInfo: {
//           clientType: clientData.clientType,
//           fullName: clientData.fullName,
//           codeNumber: clientData.codeNumber,
//           invoicingMethod: clientData.invoicingMethod,
//           currency: clientData.currency,
//           category: clientData.category,
//           notes: clientData.notes,
//           attachments: clientData.attachments.map((file) => file.name),
//           displayLanguage: clientData.displayLanguage,
//           priceGroup: clientData.priceGroup,
//           account: clientData.account,
//           itemTags: clientData.itemTags,
//           addSecondaryAddress: clientData.addSecondaryAddress,
//           contactsList: clientData.contactsList,
//         },
//       });

//       const estimate = {
//         clientData,
//         estimateData,
//         items,
//         discountType,
//         discountValue,
//         adjustment,
//         account,
//         shippingInstructions,
//         noteTerms,
//         files: Array.from(files).map((file) => file.name),
//       };
//       localStorage.setItem("savedEstimate", JSON.stringify(estimate));
//       window.print();
//     } catch (error) {
//       setShowError(true);
//     }
//   };

//   const methodOptions = [
//     { label: "Print (Offline)", value: "Print (Offline)" },
//   ];
//   const layoutOptions = [
//     { label: "Default Timesheet Layout", value: "Default Timesheet Layout" },
//   ];

//   return (
//     <Container className="p-4 bg-white rounded-lg shadow">
//       {showError && (
//         <Alert
//           variant="danger"
//           message="Please fill in the business name, full name, code number, and at least one item before saving."
//           onClose={() => setShowError(false)}
//         />
//       )}
//       {error && (
//         <Alert
//           variant="danger"
//           message={error}
//           onClose={() => setShowError(false)}
//         />
//       )}
//       <BodyHeader
//         heading="Create Invoice"
//         subHeading="Fill in the details below to create a new invoice"
//       />
//       <div className="flex flex-col md:flex-row justify-between mb-4">
//         <div className="flex gap-2 mb-3 md:mb-0">
//           <Dropdown
//             buttonText="Preview"
//             icon={IoEyeOutline}
//             items={[
//               { label: "Web Preview", value: "web" },
//               { label: "PDF Preview", value: "pdf" },
//             ]}
//             onSelect={(item) => item.value === "web" && handlePreview()}
//           />
//           <OutlineButton
//             buttonText="Save as Draft"
//             textColor="text-gray-600"
//             borderColor="border-gray-600"
//             hover="hover:bg-gray-50"
//             onClick={handleSaveAsDraft}
//             disabled={isLoading}
//           />
//         </div>
//         <FilledButton
//           buttonText="Save & Print"
//           bgColor="bg-blue-600"
//           onClick={handleSaveAndPrint}
//           disabled={isLoading}
//         />
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <SelectBox
//           label="Method"
//           name="method"
//           value="Print (Offline)"
//           optionList={methodOptions}
//           width="w-full"
//         />
//         <SelectBox
//           label="Invoice Layout"
//           name="layout"
//           value="Default Timesheet Layout"
//           optionList={layoutOptions}
//           width="w-full"
//         />
//       </div>
//       <Card className="p-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <ClientDetails
//             clientData={clientData}
//             setClientData={setClientData}
//             validateForm={showError}
//           />
//           <EstimateInfo
//             estimateData={estimateData}
//             setEstimateData={setEstimateData}
//           />
//         </div>
//       </Card>
//       <ItemsTable
//         items={items}
//         handleItemChange={handleItemChange}
//         handleAddRow={handleAddRow}
//         handleRemoveRow={handleRemoveRow}
//         total={total}
//         itemsTotal={itemsTotal}
//       />
//       <Card className="mb-4">
//         <Tabs
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           tabs={[
//             { key: "discount", label: "Discount & Adjustment" },
//             { key: "shipping", label: "Shipping Details" },
//             { key: "documents", label: "Attach Documents" },
//           ]}
//         >
//           {activeTab === "discount" && (
//             <DiscountAdjustmentTab
//               discountValue={discountValue}
//               setDiscountValue={setDiscountValue}
//               discountType={discountType}
//               setDiscountType={setDiscountType}
//               adjustment={adjustment}
//               setAdjustment={setAdjustment}
//               account={account}
//               setAccount={setAccount}
//             />
//           )}
//           {activeTab === "shipping" && (
//             <ShippingDetailsTab
//               shippingInstructions={shippingInstructions}
//               setShippingInstructions={setShippingInstructions}
//             />
//           )}
//           {activeTab === "documents" && (
//             <AttachDocumentsTab setFiles={setFiles} />
//           )}
//         </Tabs>
//       </Card>
//       <Card className="mb-4">
//         <div className="p-4">
//           <h5 className="text-lg font-bold mb-2">Notes / Terms</h5>
//           <textarea
//             value={noteTerms}
//             onChange={(e) => setNoteTerms(e.target.value)}
//             className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter notes and terms..."
//           />
//         </div>
//       </Card>
//       <div className="flex justify-end gap-2">
//         <OutlineButton
//           buttonText="Cancel"
//           textColor="text-gray-600"
//           borderColor="border-gray-600"
//           hover="hover:bg-gray-50"
//           onClick={onBack}
//         />
//         <FilledButton
//           buttonText="Save Estimate"
//           bgColor="bg-blue-600"
//           onClick={handleSaveAndPrint}
//           disabled={isLoading}
//         />
//       </div>
//       <PreviewModal
//         show={showPreview}
//         handleClose={() => setShowPreview(false)}
//         estimateData={estimateData}
//         clientData={clientData}
//         items={items}
//         discountValue={discountValue}
//         discountType={discountType}
//         adjustment={adjustment}
//         account={account}
//         noteTerms={noteTerms}
//         shippingInstructions={shippingInstructions}
//         total={total}
//         itemsTotal={itemsTotal}
//       />
//     </Container>
//   );
// };

// export default CreateInvoice;





