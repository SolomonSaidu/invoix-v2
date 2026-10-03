import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/dates';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  // Top Accent Bar
  accentBar: {
    height: 6,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  classicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a',
  },
  businessInfo: {
    maxWidth: 260,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 6,
    objectFit: 'contain',
  },
  logoPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  metaText: {
    fontSize: 8,
    color: '#64748b',
    lineHeight: 1.3,
  },
  invoiceMeta: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  // Customer Box
  customerBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  classicCustomerBox: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 10,
    marginBottom: 16,
  },
  minimalCustomerBox: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    marginBottom: 16,
  },
  customerLabel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  customerName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  // Items Table
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  classicTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  classicHeaderText: {
    color: '#ffffff',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#334155',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 2, textAlign: 'right' },
  colAmount: { flex: 2, textAlign: 'right' },
  itemText: { fontSize: 8.5, color: '#334155' },
  itemBoldText: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: '#0f172a' },

  // Bottom Area: Totals & Notes
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  notesCol: {
    width: '52%',
  },
  noteBox: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  noteContent: {
    fontSize: 7.5,
    color: '#475569',
    lineHeight: 1.3,
  },
  totalsCol: {
    width: '42%',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  classicTotalsCol: {
    width: '42%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    fontSize: 8,
    color: '#475569',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 36,
    right: 36,
    textAlign: 'center',
    fontSize: 7.5,
    color: '#94a3b8',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
});

export function InvoicePDFDocument({
  invoice,
  template = 'modern',
  accentColor = '#4f46e5',
}) {
  const {
    businessSnapshot,
    customerSnapshot,
    items = [],
    currency = 'NGN',
    invoiceNumber,
    issueDate,
    dueDate,
    status = 'UNPAID',
    subtotal = 0,
    discount = 0,
    discountType = 'percentage',
    discountAmount = 0,
    taxRate = 0,
    taxAmount = 0,
    total = 0,
    paymentInstructions = '',
    terms = '',
  } = invoice;

  const isClassic = template === 'classic';
  const isMinimal = template === 'minimal';
  const isPaid = status === 'PAID';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Accent Top Bar for Modern */}
        {!isClassic && !isMinimal && (
          <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
        )}

        {/* Header */}
        <View style={isClassic ? styles.classicHeader : styles.header}>
          <View style={styles.businessInfo}>
            {businessSnapshot?.logoData ? (
              <Image src={businessSnapshot.logoData} style={styles.logo} />
            ) : (
              <View style={[styles.logoPlaceholder, { backgroundColor: accentColor }]}>
                <Text style={styles.logoPlaceholderText}>
                  {businessSnapshot?.name ? businessSnapshot.name.charAt(0).toUpperCase() : 'I'}
                </Text>
              </View>
            )}

            <Text style={styles.companyName}>
              {businessSnapshot?.name || 'Invoix User'}
            </Text>

            {businessSnapshot?.registrationNumber ? (
              <Text style={styles.metaText}>RC: {businessSnapshot.registrationNumber}</Text>
            ) : null}
            {businessSnapshot?.address ? (
              <Text style={styles.metaText}>{businessSnapshot.address}</Text>
            ) : null}
            {businessSnapshot?.email ? (
              <Text style={styles.metaText}>{businessSnapshot.email}</Text>
            ) : null}
            {businessSnapshot?.phone ? (
              <Text style={styles.metaText}>{businessSnapshot.phone}</Text>
            ) : null}
            {businessSnapshot?.taxId ? (
              <Text style={styles.metaText}>TIN: {businessSnapshot.taxId}</Text>
            ) : null}
          </View>

          <View style={styles.invoiceMeta}>
            <Text style={[styles.invoiceTitle, { color: isClassic ? '#0f172a' : accentColor }]}>
              INVOICE
            </Text>
            <Text style={styles.invoiceNumber}>#{invoiceNumber}</Text>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isPaid ? '#dcfce7' : '#fef3c7',
                  color: isPaid ? '#15803d' : '#b45309',
                },
              ]}
            >
              <Text>{status}</Text>
            </View>

            <Text style={styles.metaText}>Issued: {formatDate(issueDate)}</Text>
            <Text style={styles.metaText}>Due Date: {formatDate(dueDate)}</Text>
          </View>
        </View>

        {/* Customer Box */}
        <View
          style={
            isClassic
              ? styles.classicCustomerBox
              : isMinimal
              ? styles.minimalCustomerBox
              : styles.customerBox
          }
        >
          <Text style={styles.customerLabel}>Billed To:</Text>
          <Text style={styles.customerName}>
            {customerSnapshot?.name || 'Walk-in Customer'}
          </Text>
          {customerSnapshot?.email ? (
            <Text style={styles.metaText}>{customerSnapshot.email}</Text>
          ) : null}
          {customerSnapshot?.phone ? (
            <Text style={styles.metaText}>{customerSnapshot.phone}</Text>
          ) : null}
          {customerSnapshot?.address ? (
            <Text style={styles.metaText}>{customerSnapshot.address}</Text>
          ) : null}
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={isClassic ? styles.classicTableHeader : styles.tableHeader}>
            <Text style={[styles.colDesc, isClassic ? styles.classicHeaderText : styles.tableHeaderText]}>
              Description
            </Text>
            <Text style={[styles.colQty, isClassic ? styles.classicHeaderText : styles.tableHeaderText]}>
              Qty
            </Text>
            <Text style={[styles.colPrice, isClassic ? styles.classicHeaderText : styles.tableHeaderText]}>
              Unit Price
            </Text>
            <Text style={[styles.colAmount, isClassic ? styles.classicHeaderText : styles.tableHeaderText]}>
              Amount
            </Text>
          </View>

          {items.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={[styles.colDesc, styles.itemBoldText]}>
                {item.description || 'Item'}
              </Text>
              <Text style={[styles.colQty, styles.itemText]}>{item.quantity}</Text>
              <Text style={[styles.colPrice, styles.itemText]}>
                {formatCurrency(item.unitPrice, currency)}
              </Text>
              <Text style={[styles.colAmount, styles.itemBoldText]}>
                {formatCurrency(item.amount || (item.quantity * item.unitPrice), currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Bottom Totals & Notes */}
        <View style={styles.bottomContainer} wrap={false}>
          <View style={styles.notesCol}>
            {paymentInstructions ? (
              <View style={styles.noteBox}>
                <Text style={styles.noteTitle}>Payment Instructions:</Text>
                <Text style={styles.noteContent}>{paymentInstructions}</Text>
              </View>
            ) : null}

            {terms ? (
              <View style={styles.noteBox}>
                <Text style={styles.noteTitle}>Terms & Conditions:</Text>
                <Text style={styles.noteContent}>{terms}</Text>
              </View>
            ) : null}
          </View>

          <View style={isClassic ? styles.classicTotalsCol : styles.totalsCol}>
            <View style={styles.totalsRow}>
              <Text>Subtotal:</Text>
              <Text style={styles.itemBoldText}>{formatCurrency(subtotal, currency)}</Text>
            </View>

            {discountAmount > 0 && (
              <View style={styles.totalsRow}>
                <Text>
                  Discount {discountType === 'percentage' ? `(${discount}%)` : ''}:
                </Text>
                <Text style={{ color: '#16a34a', fontFamily: 'Helvetica-Bold' }}>
                  - {formatCurrency(discountAmount, currency)}
                </Text>
              </View>
            )}

            {taxAmount > 0 && (
              <View style={styles.totalsRow}>
                <Text>Tax / VAT ({taxRate}%):</Text>
                <Text style={styles.itemBoldText}>+ {formatCurrency(taxAmount, currency)}</Text>
              </View>
            )}

            <View style={styles.grandTotalRow}>
              <Text>Total Due:</Text>
              <Text style={{ color: isClassic ? '#0f172a' : accentColor }}>
                {formatCurrency(total, currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Page Footer */}
        <View style={styles.footer} fixed>
          <Text>Generated with Invoix — Offline-First Invoicing Studio</Text>
        </View>
      </Page>
    </Document>
  );
}
