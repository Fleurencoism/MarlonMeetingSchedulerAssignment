import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import styles from './styles';
import Host from '../../components/Host';
import { useNavigation } from '@react-navigation/native';

// import openDatabase hook
import { openDatabase } from "react-native-sqlite-storage";

// create constant object that refers to database
const schedulerDB = openDatabase({name: 'Scheduler.db'});

// create constant that contains the name of the lists table
const hostTableName = 'hosts';

const AssignMeetingScreen = props => {

    const post = props.route.params.post;

    const navigation = useNavigation();

  const [host, setHost] = useState([]);


  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      // declare empty array that will store results of SELECT
      let results = [];
      // declare transaction that will execute SELECT
      shopperDB.transaction(txn => {
        // execute SELECT
        txn.executeSql(
          `SELECT * FROM ${hostTableName}`,
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
                  meeting_id: post.id,
                });
              }
              // assign results array to lists state variable
              setHost(results);
            } else {
              // if no rows of data were selected
              // assign empty array to lists state variable
              setHost([]);
            }
          },
          error => {
            console.log('Error getting hosts ' + error.message);
          },
        )
      });
    });
    return listener;
  });

  return (
    <View style={styles.container}>
        <FlatList
          data={host}
          renderItem={({host}) => <Host post={item} />}
        />
    </View>
  );
};

export default AssignMeetingScreen;