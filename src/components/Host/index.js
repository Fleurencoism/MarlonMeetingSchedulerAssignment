import React from 'react';
import styles from './styles';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const database = require('../Handlers/database.js');

const Host = props => {

    const post = props.post;

    // console.log(post);

    const navigation = useNavigation();

    const onPress = () => {
        navigation.navigate('Existing Host', {post: post});
        
        if (post.meeting_id) {
            try {
                database.addListItem(post.meeting_id, post.id);
            } catch (error){
                console.log('Error adding meeting host' + error);
            }
            alert('Host added to meeting!');
        } else {
            console.log(post.name);
        }
    }

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.touchable} onPress={onPress}>
            <View style={{flex: 2}}>
                <Text style={styles.name} numberOfLines={1}>{post.name}</Text>
                <Text style={styles.email} numberOfLines={1}>{post.email}</Text>
            </View>
        </TouchableOpacity>
    </View>
  );
};

export default Host;