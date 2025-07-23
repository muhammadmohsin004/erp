import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store"; // ← Changed this line

import { AuthProvider } from "./Contexts/AuthContexts/AuthContextsApi";
import { Routes } from "./routes/Route";
import { SuperAdminProvider } from "./Contexts/superAdminApiClient/superAdminApiClient";
import { ClientsProvider } from "./Contexts/apiClientContext/apiClientContext";
import { WarehouseProvider } from "./Contexts/WarehouseContext/WarehouseContext";
import { SupplierProvider } from "./Contexts/SupplierContext/SupplierContext";
import { ServiceProvider } from "./Contexts/ServiceContext/ServiceContext";
import { ProductsManagerProvider } from "./Contexts/ProductsManagerContext/ProductsManagerContext";
import { SuperDashboardProvider } from "./Contexts/superAdminDashborad/SuperAdminContext";
import { RequisitionProvider } from "./Contexts/RequisitionContext/RequisitionContext";
import { PriceListProvider } from "./Contexts/PriceListContext/PriceListContext";
import { InvoicesProvider } from "./Contexts/InvoiceContext/InvoiceContext";
import { SalaryProvider } from "./Contexts/SalaryManagementContext/SalaryManagementContext";
import { LeaveAttendanceProvider } from "./Contexts/LeaveContext/LeaveContext";
import { CompanyBranchProvider } from "./Contexts/CompanyBranchContext/CompanyBranchContext";
import { StockProvider } from "./Contexts/StockContext/StockContext";
import { FinanceProvider } from "./Contexts/FinanceContext/FinanceContext";
import { DashboardProvider } from "./Contexts/DashboardContext/DashboardContext";
import { VendorProvider } from "./Contexts/VendorContext/VendorContext";
import { BankAccountProvider } from "./Contexts/BankAccountContext/BankAccountContext";
import { FinanceDashboardProvider } from "./Contexts/FinanceContext/FinanceDashboardContext";
import { ExpenseCategoryProvider } from "./Contexts/ExpenseCategoryContext/ExpenseCategoryContext";
import { FinanceExpensesProvider } from "./Contexts/FinanceContext/FinanceExpensesContext";
import { FinanceIncomesProvider } from "./Contexts/FinanceContext/FinanceIncomeContext";
import { IncomeCategoryProvider } from "./Contexts/IncomeCategoryContext/IncomeCategoryContext";
import { FinanceReportsProvider } from "./Contexts/FinanceReportsContext";
import { HRProvider } from "./Contexts/HRContext/HRContext";
function App() {
  return (
    <Router>
      <Provider store={store}>
        <AuthProvider>
          <SuperAdminProvider>
            <SuperDashboardProvider>
              <ClientsProvider>
                <WarehouseProvider>
                  <SupplierProvider>
                    <ServiceProvider>
                      <ProductsManagerProvider>
                        <HRProvider>
                          <RequisitionProvider>
                            <PriceListProvider>
                              <InvoicesProvider>
                                <SalaryProvider>
                                  <CompanyBranchProvider>
                                    <StockProvider>
                                      <FinanceProvider>
                                        <DashboardProvider>
                                          <LeaveAttendanceProvider>
                                            <VendorProvider>
                                              <BankAccountProvider>
                                                <FinanceDashboardProvider>
                                                  <ExpenseCategoryProvider>
                                                    <FinanceExpensesProvider>
                                                      <FinanceIncomesProvider>
                                                        <IncomeCategoryProvider>
                                                          <FinanceReportsProvider>
                                                            <Routes />
                                                          </FinanceReportsProvider>
                                                        </IncomeCategoryProvider>
                                                      </FinanceIncomesProvider>
                                                    </FinanceExpensesProvider>
                                                  </ExpenseCategoryProvider>
                                                </FinanceDashboardProvider>
                                              </BankAccountProvider>
                                            </VendorProvider>
                                          </LeaveAttendanceProvider>
                                        </DashboardProvider>
                                      </FinanceProvider>
                                    </StockProvider>
                                  </CompanyBranchProvider>
                                </SalaryProvider>
                              </InvoicesProvider>
                            </PriceListProvider>
                          </RequisitionProvider>
                        </HRProvider>
                      </ProductsManagerProvider>
                    </ServiceProvider>
                  </SupplierProvider>
                </WarehouseProvider>
              </ClientsProvider>
            </SuperDashboardProvider>
          </SuperAdminProvider>
        </AuthProvider>
      </Provider>
    </Router>
  );
}

export default App;
