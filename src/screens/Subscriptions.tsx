import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import {
  PurchaseError,
  useIAP,
  validateReceiptIos,
  validateReceiptAndroid,
  requestSubscription,
} from 'react-native-iap';

const errorLog = ({ message, error }) => {
  console.log('🚀 ~ file: Subscriptions.tsx:22 ~ error:', error);
  console.log('🚀 ~ file: Subscriptions.tsx:22 ~ message:', message);
};

const isIos = Platform.OS === 'ios';

//product id from appstoreconnect app->subscriptions
const subscriptionSkus = Platform.select({
  ios: ['subscriptionmonthly_29'],
  android: ['monthlysubscription'], // Add Android subscription SKUs
});

export const Subscriptions = ({ navigation }) => {
  //useIAP - easy way to access react-native-iap methods to
  //get your products, purchases, subscriptions, callback
  //and error handlers.
  const {
    connected,
    subscriptions, //returns subscriptions for this app.
    getSubscriptions, //Gets available subsctiptions for this app.
    currentPurchase, //current purchase for the tranasction
    finishTransaction,
    purchaseHistory, //return the purchase history of the user on the device (sandbox user in dev)
    getPurchaseHistory, //gets users purchase history
  } = useIAP();
  console.log(
    '🚀 ~ file: Subscriptions.tsx:40 ~ subscriptions:',
    subscriptions,
  );
  console.log('🚀 ~ file: Subscriptions.tsx:40 ~ connected:', connected);
  console.log(
    '🚀 ~ file: Subscriptions.tsx:43 ~ currentPurchase:',
    currentPurchase,
  );

  const [loading, setLoading] = useState(false);

  const handleGetPurchaseHistory = async () => {
    try {
      await getPurchaseHistory();
    } catch (error) {
      errorLog({ message: 'handleGetPurchaseHistory', error });
    }
  };

  useEffect(() => {
    handleGetPurchaseHistory();
  }, [connected]);

  const handleGetSubscriptions = async () => {
    try {
      console.log('🔍 Starting getSubscriptions...');
      console.log('🔍 subscriptionSkus:', subscriptionSkus);
      console.log('🔍 Platform:', Platform.OS);
      console.log('🔍 connected:', connected);
      
      if (!connected) {
        console.log('❌ Not connected to store');
        return;
      }
      
      if (subscriptionSkus) {
        console.log('🔍 Calling getSubscriptions with:', { skus: subscriptionSkus });
        const result = await getSubscriptions({ skus: subscriptionSkus });
        console.log('🔍 getSubscriptions result type:', typeof result);
        console.log('🔍 getSubscriptions result:', result);
        console.log('🔍 Result length:', result?.length);
        console.log('🔍 Is Array:', Array.isArray(result));
        
        if (result && result.length > 0) {
          result.forEach((sub, index) => {
            console.log(`🔍 Subscription ${index}:`, sub);
          });
        }
      } else {
        console.log('❌ subscriptionSkus is null/undefined');
      }
    } catch (error) {
      console.log('❌ getSubscriptions ERROR type:', typeof error);
      console.log('❌ getSubscriptions ERROR message:', error?.message);
      console.log('❌ getSubscriptions ERROR code:', error?.code);
      console.log('❌ getSubscriptions ERROR full:', error);
      errorLog({ message: 'handleGetSubscriptions', error });
    }
  };

  useEffect(() => {
    handleGetSubscriptions();
  }, [connected]);

  useEffect(() => {
    // ... listen if connected, purchaseHistory and subscriptions exist
    if (
      subscriptionSkus &&
      purchaseHistory.find(
        x => x.productId === (subscriptionSkus[0] || subscriptionSkus[1]),
      )
    ) {
      navigation.navigate('Home');
    }
  }, [connected, purchaseHistory, subscriptions]);

  const handleBuySubscription = async productId => {
    try {
      await requestSubscription({
        sku: productId,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof PurchaseError) {
        errorLog({ message: `[${error.code}]: ${error.message}`, error });
      } else {
        errorLog({ message: 'handleBuySubscription', error });
      }
    }
  };

  useEffect(() => {
    const checkCurrentPurchase = async purchase => {
      if (purchase) {
        try {
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            if (Platform.OS === 'ios') {
              const isTestEnvironment = __DEV__;

              //send receipt body to apple server to validete
              const appleReceiptResponse = await validateReceiptIos(
                {
                  'receipt-data': receipt,
                  password: '15fbdb9d443d49d78ac3f7debe18cd88',
                },
                isTestEnvironment,
              );

              //if receipt is valid
              if (appleReceiptResponse) {
                const { status } = appleReceiptResponse;
                if (status) {
                  navigation.navigate('Home');
                }
              }
            } else if (Platform.OS === 'android') {
              // Android receipt validation
              try {
                const androidReceiptResponse = await validateReceiptAndroid({
                  packageName: 'com.hola',
                  productId: purchase.productId,
                  productToken: receipt,
                  accessToken: '', // You need to get this from Google Play Console
                });

                if (androidReceiptResponse) {
                  navigation.navigate('Home');
                }
              } catch (androidError) {
                errorLog({
                  message: 'Android receipt validation failed',
                  error: androidError,
                });
              }
            }

            // Finish the transaction
            try {
              await finishTransaction({
                purchase,
                isConsumable: false,
              });
            } catch (finishError) {
              errorLog({
                message: 'Failed to finish transaction',
                error: finishError,
              });
            }
          }
        } catch (error) {
          console.log('error', error);
        }
      }
    };
    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 10 }}>
          <Text
            style={{
              fontSize: 28,
              textAlign: 'center',
              paddingBottom: 15,
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            Subscribe
          </Text>
          <Text style={styles.listItem}>
            Subscribe to some cool stuff today.
          </Text>
          <Text
            style={
              (styles.listItem,
              {
                fontWeight: '500',
                textAlign: 'center',
                marginTop: 10,
                fontSize: 18,
              })
            }
          >
            Choose your membership plan.
          </Text>
          <View style={{ marginTop: 10 }}>
            {subscriptions.map((subscription, index) => {
              const owned = purchaseHistory.find(
                s => s?.productId === subscription.productId,
              );
              console.log('subscriptions', subscription?.productId);
              return (
                <View style={styles.box} key={index}>
                  {subscription?.introductoryPriceSubscriptionPeriodIOS && (
                    <>
                      <Text style={styles.specialTag}>SPECIAL OFFER</Text>
                    </>
                  )}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        paddingBottom: 10,
                        fontWeight: 'bold',
                        fontSize: 18,
                        textTransform: 'uppercase',
                      }}
                    >
                      {subscription?.title}
                    </Text>
                    <Text
                      style={{
                        paddingBottom: 20,
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}
                    >
                      {subscription?.localizedPrice}
                    </Text>
                  </View>
                  {subscription?.introductoryPriceSubscriptionPeriodIOS && (
                    <Text>
                      Free for 1{' '}
                      {subscription?.introductoryPriceSubscriptionPeriodIOS}
                    </Text>
                  )}
                  <Text style={{ paddingBottom: 20 }}>
                    {subscription?.description}
                  </Text>
                  {owned && (
                    <Text style={{ textAlign: 'center', marginBottom: 10 }}>
                      You are Subscribed to this plan!
                    </Text>
                  )}
                  {owned && (
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#0071bc' }]}
                      onPress={() => {
                        navigation.navigate('Home');
                      }}
                    >
                      <Text style={styles.buttonText}>Continue to App</Text>
                    </TouchableOpacity>
                  )}
                  {loading && <ActivityIndicator size="large" />}
                  {!loading && !owned && (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        setLoading(true);
                        handleBuySubscription(subscription.productId);
                      }}
                    >
                      <Text style={styles.buttonText}>Subscribe</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    paddingLeft: 8,
    paddingBottom: 3,
    textAlign: 'center',
    color: 'black',
  },
  box: {
    margin: 10,
    marginBottom: 5,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 7,
    shadowColor: 'rgba(0, 0, 0, 0.45)',
    shadowOffset: { height: 16, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'mediumseagreen',
    borderRadius: 8,
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  specialTag: {
    color: 'white',
    backgroundColor: 'crimson',
    width: 125,
    padding: 4,
    fontWeight: 'bold',
    fontSize: 12,
    borderRadius: 7,
    marginBottom: 2,
  },
});
