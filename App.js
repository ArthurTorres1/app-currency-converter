import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from './src/components/Button';
import { styles } from './App.styles';
import { currencies } from './src/constants/currencies';
import { Input } from './src/components/Input';
import { ResultCard } from './src/components/ResultCard';
import { exchangeRateApi } from './src/services/api';
import { convertCurrency } from './src/utils/convertCurrency';
import { Activity, useState } from 'react';
import { colors } from './src/styles/colors';

export default function App() {

  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('BRL')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(null)


  async function fetchExchangeRate() {

    try {
      setLoading(true)
      if (!amount) return

      const data = await exchangeRateApi(fromCurrency)
      const rate = data.conversion_rates[toCurrency]
      setExchangeRate(rate)

      const convertedAmount = convertCurrency(amount, rate)

      console.log(convertedAmount)
      setResult(convertedAmount)
    } catch (error) {
      Alert.alert('Erro, tente novamente mais tarde.')
      console.error(error)
    } finally{
      setLoading(false)
    }
  }

  function handleSwapCurrencies() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult('')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <StatusBar style="light" />

          <View style={styles.header}>
            <Text style={styles.title}>Conversor de moedas</Text>
            <Text style={styles.subTitle}>
              Converta valores entre diferentes moedas!
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>De:</Text>
            <View style={styles.currencyGrid}>
              {currencies.map(currency => (
                <Button
                  variant='primary'
                  key={currency.code}
                  currency={currency}
                  onPress={() => setFromCurrency(currency.code)}
                  isSelected={fromCurrency === currency.code}
                />
              ))}
            </View>
            <Input label="Valor: " value={amount} onChangeText={setAmount} />

            <TouchableOpacity style={styles.swapButton} onPress={handleSwapCurrencies}>
              <Text style={styles.swapButtonText}>
                ↓↑
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Para:</Text>
            <View style={styles.currencyGrid}>
              {currencies.map(currency => (
                <Button
                  variant='secondary'
                  key={currency.code}
                  currency={currency}
                  onPress={() => setToCurrency(currency.code)}
                  isSelected={toCurrency === currency.code}
                />
              ))}
            </View>
          </View>
          <TouchableOpacity
            onPress={fetchExchangeRate}
            style={[styles.convertButton, (!amount || loading) && styles.convertButtonDisabled]}
            disabled={!amount || loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.swapButtonText}>
                Converter
              </Text>
            )}
          </TouchableOpacity>

          <ResultCard
            exchangeRate={exchangeRate}
            result={result}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            currencies={currencies}
          />

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
