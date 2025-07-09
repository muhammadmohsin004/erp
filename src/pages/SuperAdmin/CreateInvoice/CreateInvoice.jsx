import { useState } from "react";
import { FiFileText, FiPlus, FiTrash2, FiSave, FiUser } from "react-icons/fi";
import Modall from "../components/Modall"; // Your custom modal component
import FilledButton from "../components/buttons/FilledButton"; // Your custom button component
import InputField from "../components/inputs/InputField"; // Your custom input component

const CreateInvoice = () => {
  // Form state
  const [invoice, setInvoice] = useState({
    customer: "",
    email: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
    items: [{ description: "", quantity: 1, price: 0, amount: 0 }],
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Sample customer data
  const customers = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Acme Corporation", email: "accounts@acme.com" },
    { id: 4, name: "Tech Solutions Ltd", email: "finance@techsolutions.com" },
  ];

  // Calculate totals
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const tax = subtotal * 0.1; // 10% tax for example
  const total = subtotal + tax;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({ ...prev, [name]: value }));
  };

  // Handle item changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [name]: value };

    // Calculate amount if quantity or price changes
    if (name === "quantity" || name === "price") {
      newItems[index].amount = newItems[index].quantity * newItems[index].price;
    }

    setInvoice((prev) => ({ ...prev, items: newItems }));
  };

  // Add new item row
  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, price: 0, amount: 0 },
      ],
    }));
  };

  // Remove item row
  const removeItem = (index) => {
    if (invoice.items.length > 1) {
      const newItems = [...invoice.items];
      newItems.splice(index, 1);
      setInvoice((prev) => ({ ...prev, items: newItems }));
    }
  };

  // Select customer
  const selectCustomer = (customer) => {
    setInvoice((prev) => ({
      ...prev,
      customer: customer.name,
      email: customer.email,
    }));
    setShowCustomerModal(false);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!invoice.customer || !invoice.email) {
      setError("Customer information is required");
      setLoading(false);
      return;
    }

    if (invoice.items.some((item) => !item.description || item.price <= 0)) {
      setError("All items must have a description and positive price");
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Generate a mock invoice ID
      const newInvoiceId = `INV-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      setLoading(false);
      setSuccessMessage(`Invoice ${newInvoiceId} created successfully!`);
      setError(null);

      // Reset form (keep customer info for convenience)
      setInvoice((prev) => ({
        customer: prev.customer,
        email: prev.email,
        date: new Date().toISOString().split("T")[0],
        dueDate: "",
        notes: "",
        items: [{ description: "", quantity: 1, price: 0, amount: 0 }],
      }));
    }, 1500);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center">
          <FiFileText className="mr-2" />
          Create New Invoice
        </h2>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg flex justify-between items-center">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-green-800"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-800">
              ×
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h5 className="text-lg font-semibold mb-4">
                  Customer Information
                </h5>
                <div className="flex mb-4">
                  <div className="relative flex-grow flex items-center">
                    <span className="absolute left-3">
                      <FiUser />
                    </span>
                    <input
                      type="text"
                      placeholder="Customer Name"
                      name="customer"
                      value={invoice.customer}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomerModal(true)}
                      className="bg-white border border-l-0 border-gray-300 rounded-r-lg px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      Select Customer
                    </button>
                  </div>
                </div>

                <div className="flex mb-4">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    @
                  </span>
                  <input
                    type="email"
                    placeholder="Customer Email"
                    name="email"
                    value={invoice.email}
                    onChange={handleInputChange}
                    required
                    className="flex-grow px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <h5 className="text-lg font-semibold mb-4">Invoice Details</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={invoice.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={invoice.dueDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <h5 className="text-lg font-semibold mb-4">Invoice Items</h5>
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-2/5">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-1/6">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-1/5">
                      Unit Price
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-1/5">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 w-1/12"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="description"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, e)}
                          required
                          className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="1"
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, e)}
                          required
                          className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            name="price"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                            className="flex-grow px-3 py-1 border rounded-r focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {formatCurrency(item.quantity * item.price)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={invoice.items.length <= 1}
                          className={`p-1 rounded-full ${
                            invoice.items.length <= 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mb-8">
              <button
                type="button"
                onClick={addItem}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <FiPlus className="mr-2" />
                Add Item
              </button>
            </div>

            <div className="flex justify-end mb-8">
              <div className="w-full md:w-1/2">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="py-1">
                        <strong>Subtotal:</strong>
                      </td>
                      <td className="py-1 text-right">
                        {formatCurrency(subtotal)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1">
                        <strong>Tax (10%):</strong>
                      </td>
                      <td className="py-1 text-right">{formatCurrency(tax)}</td>
                    </tr>
                    <tr>
                      <td className="py-1">
                        <strong>Total:</strong>
                      </td>
                      <td className="py-1 text-right">
                        <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-lg font-semibold">
                          {formatCurrency(total)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                rows={3}
                name="notes"
                value={invoice.notes}
                onChange={handleInputChange}
                placeholder="Additional notes or terms..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <FilledButton
                type="submit"
                disabled={loading}
                bgColor="bg-gradient-purple"
                textColor="text-white"
                rounded="rounded-lg"
                buttonText={loading ? "Creating..." : "Create Invoice"}
                height="h-10"
                width="w-40"
                fontWeight="font-medium"
                isIcon={!loading}
                icon={FiSave}
                isIconLeft={true}
                iconSize="text-lg"
                px="px-6"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Customer Selection Modal */}
      <Modall
        title="Select Customer"
        modalOpen={showCustomerModal}
        setModalOpen={setShowCustomerModal}
        okText=""
        cancelText="Close"
        cancelAction={() => setShowCustomerModal(false)}
        width={800}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{customer.name}</td>
                  <td className="px-4 py-2">{customer.email}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => selectCustomer(customer)}
                      className="px-3 py-1 text-sm text-purple-600 hover:text-purple-800 focus:outline-none"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modall>
    </div>
  );
};

export default CreateInvoice;
