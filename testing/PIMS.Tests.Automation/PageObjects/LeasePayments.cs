﻿using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using PIMS.Tests.Automation.Classes;
using SeleniumExtras.WaitHelpers;

namespace PIMS.Tests.Automation.PageObjects
{
    public class LeasePayments : PageObjectBase
    {
        //Payments Tab Link Element
        private By licensePaymentsLink = By.XPath("//a[contains(text(),'Payments')]");

        //Payment Init screen Elements
        private By licencePaymentsSubtitle = By.XPath("//div[contains(text(),'Payments by Term')]");
        private By licencePaymentAddBttn = By.XPath("//div[contains(text(),'Add a Term')]/parent::button");
        private By licencePaymentColumnStartEndDate = By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Start date - End date')]");
        private By licensePaymentColumnPaymentFreq = By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Payment frequency')]");
        private By licencePaymentColumnPaymentDue = By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Payment due')]");
        private By licensePaymentColumnExpectedPay = By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Expected payment ($)')]");
        private By licensePaymentExpectedPayTooltip = By.Id("expectedPaymentTooltip");
        private By licencePaymentColumnGSTBoolean = By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'GST?')]");
        private By licensePaymentColumnGSTTotal = By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'GST ($)')]");
        private By licensePaymentGSTTotalTooltip = By.Id("gstAmountTooltip");
        private By licencePaymentColumnExpectedTotal = By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Expected total ($)')]");
        private By licensePaymentExpectedTotalTooltip = By.Id("expectedTotalTooltip");
        private By licensePaymentColumnExpectedTerm = By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Expected term ($)')]");
        private By licensePaymentExpectedTermTooltip = By.Id("expectedTermTooltip");
        private By licencePaymentColumnActualTotal = By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Actual total ($)')]");
        private By licensePaymentActualTotalTooltip = By.Id("actualTotalTooltip");
        private By licensePaymentColumnExercised = By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Exercised?')]");
        private By licencePaymentColumnActions = By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Actions')]");
        private By licencePaymentsNoRows = By.CssSelector("div[data-testid='leasePaymentsTable'] div[class='no-rows-message']");

        //Payments Table Headers Elements
        private By licensePaymentsReceivedDateColumn = By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Received date')]");
        private By licensePaymentsSendDateColumn = By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Sent date')]");
        private By licensePaymentsPaymentMethodColumn = By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Payment method')]");
        private By licensePaymentsReceivedPaymentColumn = By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Received payment ($)')]");
        private By licensePaymentsSentPaymentColumn = By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Sent payment ($)')]");
        private By licensePaymentsSendPaymentTooltip = By.Id("actualReceivedPaymentTooltip");
        private By licensePaymentsGSTColumn = By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'GST ($)')]");
        private By licensePaymentsGSTTooltip = By.Id("actualGstTooltip");
        private By licensePaymentsReceivedTotalColumn = By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Received total ($)')]");
        private By licensePaymentsSentTotalColumn = By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Sent total ($)')]");
        private By licensePaymentsSendTotalTooltip = By.Id("receivedTotalTooltip");
        private By licensePaymentsPaymentStatusColumn = By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Payment status')]");
        private By licensePaymentsPaymentStatusTooltip = By.Id("paymentStatusTooltip");
        private By licensePaymentsNotesColumn = By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Notes')]");
        private By licensePaymentsActionsColumn = By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='thead thead-light']/div/div/div[contains(text(),'Actions')]");

        //Payments Modal Element
        private By licensePaymentsModal = By.CssSelector("div[class='modal-content']");

        //Create Term Elements
        private By licensePaymentTermStartDateLabel = By.XPath("//label[contains(text(),'Start date')]");
        private By licensePaymentTermStartDateInput = By.CssSelector("input[id='datepicker-startDate']");
        private By licensePaymentTermEndDateLabel = By.XPath("//label[contains(text(),'End date')]");
        private By licensePaymentTermEndDateInput = By.Id("datepicker-expiryDate");
        private By licensePaymentTermFrequencySelectLabel = By.XPath("//label[contains(text(),'Payment frequency')]");
        private By licensePaymentTermFrequencySelect = By.Id("input-leasePmtFreqTypeCode.id");
        private By licensePaymentTermAgreedPaymentLabel = By.XPath("//label[contains(text(),'Agreed payment ($)')]");
        private By licensePaymentTermAgreedPaymentInput = By.Id("input-paymentAmount");
        private By licensePaymentTermDueLabel = By.XPath("//label[contains(text(),'Payments due')]");
        private By licensePaymentTermDueTooltip = By.Id("paymentDueDate-tooltip");
        private By licensePaymentTermDueInput = By.Id("input-paymentDueDate");
        private By licensePaymentTermGSTLabel = By.XPath("//label[contains(text(),'Subject to GST?')]");
        private By licensePaymentTermGSTRadioBttns = By.Name("isGstEligible");
        private By licencePyamentTermGSTTrueRadioBttn = By.Id("input-isGstEligible");
        private By licencePyamentTermGSTFalseRadioBttn = By.Id("input-isGstEligible-2");
        private By licensePaymentTermLabel = By.XPath("//label[contains(text(),'Term Status')]");
        private By licensePaymentTermSelect = By.Id("input-statusTypeCode.id");

        //Create Payment Elements
        private By licensePaymentSendDateLabel = By.XPath("//label[contains(text(),'Sent date')]");
        private By licensePaymentSendDateInput = By.Id("datepicker-receivedDate");
        private By licensePaymentMethodLabel = By.XPath("//label[contains(text(),'Method')]");
        private By licensePaymentMethodSelect = By.Id("input-leasePaymentMethodType.id");
        private By licensePaymentAmountReceivedLabel = By.XPath("//label[contains(text(),'Total received ($)')]");
        private By licensePaymentAmountReceivedInput = By.Id("input-amountTotal");
        private By licensePaymentExpPaymentLabel = By.XPath("//label[contains(text(),'Expected payment ($)')]");
        private By licensePaymentExpPaymentInput = By.Id("input-amountPreTax");
        private By licensePaymentGSTLabel = By.XPath("//label[contains(text(),'GST ($)')]");
        private By licensePaymentExpPaymentTolltip = By.Id("actual-calculation-tooltip");
        private By licensePaymentGSTInput = By.Id("input-amountGst");

        //Last Term Table Elements
        private int totalTermsInLease;
        private By licenseTermsTotal = By.CssSelector("div[data-testid='leasePaymentsTable'] div[class='tr-wrapper'] div[class='td expander svg-btn']");
        

        //Last Payment Elements
        private int totalPaymentInTerm;
        private By licensePaymentsTableTotal = By.CssSelector("div[data-testid='leasePaymentsTable'] div[data-testid='securityDepositsTable'] div[class='tbody'] div[class='tr-wrapper']");
        private By licensePaymentDeleteTermBttn = By.CssSelector("button[title='delete term']");

        
        private SharedModals sharedModals;
        private LeaseDetails leaseDetails;

        public LeasePayments(IWebDriver webDriver) : base(webDriver)
        {
            sharedModals = new SharedModals(webDriver);
            leaseDetails = new LeaseDetails(webDriver);
            totalTermsInLease = 0;
            totalPaymentInTerm = 0;
        }

        //Navigates to Payments Section
        public void NavigateToPaymentSection()
        {
            Wait();
            webDriver.FindElement(licensePaymentsLink).Click();
        }

        public void AddTermBttn()
        {
            Wait();
            ButtonElement("Add a Term");
        }

        public void AddTerm(Term term)
        {
            Wait();

            var startDateInputElement = webDriver.FindElement(licensePaymentTermStartDateInput);

            if (startDateInputElement.GetAttribute("value") == "")
            {
                startDateInputElement.Click();
                startDateInputElement.SendKeys(term.TermStartDate);
            }

            Wait();

            webDriver.FindElement(licensePaymentTermEndDateInput).Click();
            webDriver.FindElement(licensePaymentTermEndDateInput).SendKeys(term.TermEndDate);
            webDriver.FindElement(licensePaymentTermEndDateInput).SendKeys(Keys.Enter);

            ChooseSpecificSelectOption(licensePaymentTermFrequencySelect, term.TermPaymentFrequency);

            webDriver.FindElement(licensePaymentTermAgreedPaymentInput).SendKeys(term.TermAgreedPayment);

            webDriver.FindElement(licensePaymentTermDueInput).SendKeys(term.TermPaymentsDue);

            if (term.IsGSTEligible)
                webDriver.FindElement(licencePyamentTermGSTTrueRadioBttn).Click();
            else
            webDriver.FindElement(licencePyamentTermGSTFalseRadioBttn).Click();

            ChooseSpecificSelectOption(licensePaymentTermSelect, term.TermStatus);

            ButtonElement("Save term");

            Wait();
            totalTermsInLease = webDriver.FindElements(licenseTermsTotal).Count;
        }

        public void OpenPaymentTab(int index)
        {
            Wait();

            var selectedExpander = webDriver.FindElement(By.XPath("//div[@class='tr-wrapper']["+ index +"]/div/div[@class='td expander svg-btn']"));
            selectedExpander.Click();
        }

        public void AddPaymentBttn()
        {
            Wait();
            ButtonElement("Record a Payment");
        }

        public void AddPayment(Payment payment)
        {
            Wait();

            webDriver.FindElement(licensePaymentSendDateInput).Click();
            webDriver.FindElement(licensePaymentSendDateInput).SendKeys(payment.PaymentSentDate);
            webDriver.FindElement(licensePaymentSendDateInput).SendKeys(Keys.Enter);
            webDriver.FindElement(licensePaymentsModal).Click();

            ChooseSpecificSelectOption(licensePaymentMethodSelect, payment.PaymentMethod);

            webDriver.FindElement(licensePaymentAmountReceivedInput).SendKeys(payment.PaymentTotalReceived);

            ButtonElement("Save payment");

            Wait();
            totalPaymentInTerm = webDriver.FindElements(licensePaymentsTableTotal).Count;
        }

        public void DeleteLastTerm()
        {
            Wait();
            webDriver.FindElement(licensePaymentDeleteTermBttn).Click();

            WaitUntil(licensePaymentsModal);
            sharedModals.ModalClickOKBttn();

            totalTermsInLease = webDriver.FindElements(licenseTermsTotal).Count;
        }

        public void DeleteLastPayment()
        {
            Wait();

            var totalPayments = webDriver.FindElements(licensePaymentsTableTotal).Count();
            var lastPaymentDeleteIcon = By.CssSelector("div[class='tbody'] div[class='tr-wrapper']:nth-child("+totalPayments+") button[title='delete actual']");
            webDriver.FindElement(lastPaymentDeleteIcon).Click();

            WaitUntil(licensePaymentsModal);
            sharedModals.ModalClickOKBttn();

            totalPaymentInTerm = webDriver.FindElements(licensePaymentsTableTotal).Count;
        }

        public int TotalTerms()
        {
            Wait();
            return webDriver.FindElements(licenseTermsTotal).Count;
        }

        public int TotalPayments()
        {
            Wait();
            return webDriver.FindElements(licensePaymentsTableTotal).Count;
        }

        public void VerifyPaymentsInitForm()
        {
            Wait();
            Assert.True(webDriver.FindElement(licencePaymentsSubtitle).Displayed);

            Assert.True(webDriver.FindElement(licencePaymentAddBttn).Displayed);
            Assert.True(webDriver.FindElement(licencePaymentColumnStartEndDate).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentColumnPaymentFreq).Displayed);
            Assert.True(webDriver.FindElement(licencePaymentColumnPaymentDue).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentColumnExpectedPay).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentExpectedPayTooltip).Displayed);
            Assert.True(webDriver.FindElement(licencePaymentColumnGSTBoolean).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentColumnGSTTotal).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentGSTTotalTooltip).Displayed);
            Assert.True(webDriver.FindElement(licencePaymentColumnExpectedTotal).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentExpectedTotalTooltip).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentColumnExpectedTerm).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentExpectedTermTooltip).Displayed);
            Assert.True(webDriver.FindElement(licencePaymentColumnActualTotal).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentActualTotalTooltip).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentColumnExercised).Displayed);
            Assert.True(webDriver.FindElement(licencePaymentColumnActions).Displayed);
            Assert.True(webDriver.FindElement(licencePaymentsNoRows).Displayed);
        }

        public void VerifyCreateTermForm()
        {
            Wait();
            Assert.True(sharedModals.ModalHeader() == "Add a Term");

            Assert.True(webDriver.FindElement(licensePaymentTermStartDateLabel).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermStartDateInput).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermEndDateLabel).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermEndDateInput).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermFrequencySelectLabel).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermFrequencySelect).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermAgreedPaymentLabel).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermAgreedPaymentInput).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermDueLabel).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermDueTooltip).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermDueInput).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermGSTLabel).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermGSTRadioBttns).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermLabel).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentTermSelect).Displayed);

            sharedModals.VerifyButtonsPresence();
        }

        public void VerifyInsertedTermTable(Term term)
        {
            Wait();

            //Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalTermsInLease +"]/div[@class='tr']/div[@class='td expander svg-btn']/following-sibling::div[1]")).Text == termType);
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalTermsInLease +"]/div[@class='tr']/div[@class='td expander svg-btn']/following-sibling::div[2]")).Text == ConcatenateDates(term.TermStartDate, term.TermEndDate));
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalTermsInLease +"]/div[@class='tr']/div[@class='td expander svg-btn']/following-sibling::div[3]")).Text == term.TermPaymentFrequency);
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalTermsInLease +"]/div[@class='tr']/div[@class='td expander svg-btn']/following-sibling::div[4]")).Text == term.TermPaymentsDue);
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalTermsInLease +"]/div[@class='tr']/div[@class='td expander svg-btn']/following-sibling::div[5]")).Text == TransformCurrencyFormat(term.TermAgreedPayment));
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalTermsInLease +"]/div[@class='tr']/div[@class='td expander svg-btn']/following-sibling::div[6]")).Text == TransformBooleanFormat(term.IsGSTEligible));
            if (term.IsGSTEligible)
            {
                Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='tbody']/div[@class='tr-wrapper'][" + totalTermsInLease + "]/div[@class='tr']/div[@class='td expander svg-btn']/following-sibling::div[7]")).Text == CalculateGST(term.TermAgreedPayment, term.IsGSTEligible));
                Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='tbody']/div[@class='tr-wrapper'][" + totalTermsInLease + "]/div[@class='tr']/div[@class='td expander svg-btn']/following-sibling::div[8]")).Text == CalculateExpectedTotal(term.TermAgreedPayment));
            }
            else
            {
                Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='tbody']/div[@class='tr-wrapper'][" + totalTermsInLease + "]/div[@class='tr']/div[@class='td expander svg-btn']/following-sibling::div[7]")).Text == "-");
                Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='tbody']/div[@class='tr-wrapper'][" + totalTermsInLease + "]/div[@class='tr']/div[@class='td expander svg-btn']/following-sibling::div[8]")).Text == TransformCurrencyFormat(term.TermAgreedPayment));
            }
            
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalTermsInLease +"]/div[@class='tr']/div[@class='td expander svg-btn']/following-sibling::div[9]")).Text == CalculateExpectedTerm(term.TermPaymentFrequency, term.IsGSTEligible, term.TermAgreedPayment, term.TermStartDate, term.TermEndDate));
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalTermsInLease +"]/div[@class='tr']/div[@class='td expander svg-btn']/following-sibling::div[10]")).Text == DisplayActualTotal(term.IsGSTEligible));
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalTermsInLease +"]/div[@class='tr']/div[@class='td expander svg-btn']/following-sibling::div[11]")).Text == DisplayTerm(term.TermStatus));
        }

        public void VerifyCreatePaymentForm()
        {
            Wait();
            Assert.True(sharedModals.ModalHeader() == "Payment details");

            Assert.True(webDriver.FindElement(licensePaymentSendDateLabel).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentSendDateInput).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentMethodLabel).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentMethodSelect).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentAmountReceivedLabel).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentAmountReceivedInput).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentExpPaymentLabel).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentExpPaymentInput).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentGSTLabel).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentExpPaymentTolltip).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentGSTInput).Displayed);

            sharedModals.VerifyButtonsPresence();
        }

        public void VerifyPaymentTableHeader()
        {
            Wait();

            if (leaseDetails.GetLeaseAccountType() == "Receivable")
            {
                Assert.True(webDriver.FindElement(licensePaymentsReceivedDateColumn).Displayed);
                Assert.True(webDriver.FindElement(licensePaymentsReceivedPaymentColumn).Displayed);
                Assert.True(webDriver.FindElement(licensePaymentsReceivedTotalColumn).Displayed);
            }
            else
            {
                Assert.True(webDriver.FindElement(licensePaymentsSendDateColumn).Displayed);
                Assert.True(webDriver.FindElement(licensePaymentsSentPaymentColumn).Displayed);
                Assert.True(webDriver.FindElement(licensePaymentsSentTotalColumn).Displayed);
            }
            
            Assert.True(webDriver.FindElement(licensePaymentsPaymentMethodColumn).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentsSendPaymentTooltip).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentsGSTColumn).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentsGSTTooltip).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentsSendTotalTooltip).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentsPaymentStatusColumn).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentsPaymentStatusTooltip).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentsNotesColumn).Displayed);
            Assert.True(webDriver.FindElement(licensePaymentsActionsColumn).Displayed);
        }

        public void VerifyInsertedPayment(Payment payment)
        {
            Wait();

            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalPaymentInTerm +"]/div/div[1]")).Text == TransformDateFormat(payment.PaymentSentDate));
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalPaymentInTerm +"]/div/div[2]")).Text == payment.PaymentMethod);
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalPaymentInTerm +"]/div/div[3]")).Text == TransformCurrencyFormat(payment.PaymentExpectedPayment));
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalPaymentInTerm +"]/div/div[4]")).Text == TransformCurrencyFormat(payment.PaymentGST));
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalPaymentInTerm +"]/div/div[5]")).Text == TransformCurrencyFormat(payment.PaymentTotalReceived));
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalPaymentInTerm +"]/div/div[6]")).Text == payment.PaymentStatus);
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalPaymentInTerm +"]/div/div[7]/button[@title='notes']")).Displayed);
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalPaymentInTerm +"]/div/div[8]/div/button[@title='edit actual']")).Displayed);
            Assert.True(webDriver.FindElement(By.XPath("//div[@data-testid='leasePaymentsTable']/div/div/div/div/div/div[@data-testid='securityDepositsTable']/div[@class='tbody']/div[@class='tr-wrapper']["+ totalPaymentInTerm +"]/div/div[8]/div/button[@title='delete actual']")).Displayed);
        }

        private string ConcatenateDates(string startDate, string endDate)
        {
            var startDateFormat = DateTime.Parse(startDate);
            var endDateFormat = DateTime.Parse(endDate);

            return startDateFormat.ToString("MMM dd, yyyy") +" - "+ endDateFormat.ToString("MMM dd, yyyy");
        }

        private string CalculateGST(string amount, bool gst)
        {
            if (gst)
            {
                decimal value = decimal.Parse(amount) * 0.05m;
                return "$" + value.ToString("#,##0.00");
            }
            else
            {
                return "-";
            } 
        }

        private string DisplayTerm(string termStatus)
        {
            if (termStatus == "Exercised")
                return "Y";
            else
                return "N";
        }

        private string CalculateExpectedTotal(string amount)
        {
            decimal expectedValue = decimal.Parse(amount);
            decimal gstValue = decimal.Parse(amount) * 0.05m;
            decimal total = expectedValue + gstValue;

            return "$" + total.ToString("#,##0.00");
        }

        private string CalculateExpectedTerm(string frequency, bool gst, string amount, string startDate, string endDate)
        {
            var frequencyNumber = 0 ;
            var unitAmount = decimal.Parse(amount);
            var startDateFormat = DateTime.Parse(startDate);
            var endDateFormat = DateTime.Parse(endDate);

            switch (frequency)
            {
                case "Daily":
                    var numberOfDays = (endDateFormat - startDateFormat).TotalDays;
                    frequencyNumber = (int)Math.Ceiling(numberOfDays);
                    break;
                case "Weekly":
                    var numberOfWeeks = (endDateFormat - startDateFormat).TotalDays /7;
                    frequencyNumber = (int)Math.Ceiling(numberOfWeeks);
                    break;
                case "Monthly":
                    var numberOfMonths = (endDateFormat - startDateFormat).TotalDays /30;
                    frequencyNumber = (int)Math.Ceiling(numberOfMonths);
                    break;
                default:
                    frequencyNumber = 1;
                    break;
            }

            if (gst)
            {
                unitAmount += decimal.Parse(amount) * 0.05m;
            }

            var finalAmount = frequencyNumber * unitAmount;

            if (finalAmount == 0)
            {
                return "-";
            }
            else
            {
                return "$" + finalAmount.ToString("#,##0.00");
            } 
        }

        private string DisplayActualTotal(bool GST)
        {
            if (GST)
                return "$0.00";
            else
                return "-";
        }

        private string CalculatePaymentStatus(string paymentAmount, string gst, string expectedAmount)
        {
            var unitAmount = decimal.Parse(paymentAmount);
            var totalAmount = decimal.Parse(expectedAmount);

            if (gst == "Y")
            {
                unitAmount += decimal.Parse(paymentAmount) * 0.05m;
                totalAmount += decimal.Parse(expectedAmount) * 0.05m;
            }

            if (totalAmount > unitAmount)
            {
                return "Overpayment";
            }
            else if (totalAmount < unitAmount)
            {
                return "Partial";
            }
            else
            {
                return "Paid";
            }
        }
    }
}
