
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import styles from './styles';
import Item from '../../components/Item';
import { useNavigation } from '@react-navigation/native';


// import openDatabase hook
import { openDatabase } from "react-native-sqlite-storage";

// create constant object that refers to database
const shopperDB = openDatabase({name: 'Shopper.db'});

// create constant that contains the name of the lists table
const hostTableName = 'hosts';
const meetingTableName = 'meetings';

const ViewListItemsScreen = props => {

  const post = props.route.params.post;
  const navigation = useNavigation();

  const [host, setHosts] = useState([]);
  const [meeting, setMeeting] = useState([]);

  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      // declare empty array that will store results of SELECT
      let results = [];
      // declare variable to compute the total price
      let total = 0.0;
      // declare transaction that will execute SELECT
      shopperDB.transaction(txn => {
        // execute SELECT
        txn.executeSql(
          `SELECT items.id, name, email, title, location, date FROM ${itemsTableName}, ${listItemsTableName} WHERE items.id = item_id AND list_id = ${post.id}`,
          [],
          // callback function to handle results from SELECT
          (_, res) => {
            // get the number of rows selected 
            let len = res.rows.length;
            console.log('Number of rows: ' + len);
            

            // if more than one row of data was selected
            if ( len > 0){
              // loop through the rows of data
              for (let i = 0; i < len; i++){
                // push a row of data at a time onto results array
                let item = res.rows.item(i);

                results.push({
                  id: item.id,
                  name: item.name,
                  email: item.email,
                  title: item.title,
                  location: item.location,
                  date: item.date,
                });
              }
              // assign results array to items state variable
              setHosts(results);
            } else {
              // if no rows of data were selected
              // assign empty array to items state variable
              setHosts([]);
            }
          },
          error => {
            console.log('Error getting meeting ' + error.message);
          },
        )
      });
    });
    return listener;
  });

  const ListHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>{post.name}</Text>
      </View>
    );
  };

  const ListFooter = () => {
    return (
      <View style={styles.footer}>
        <Text style={styles.totalPrice}>TOTAL MEETINGs: {totalPrice.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({item}) => <Item post={item} />}
        ListFooterComponent={ListFooter}
        ListHeaderComponent={ListHeader}
      />
    </View>
  );
};

export default ViewListItemsScreen;
