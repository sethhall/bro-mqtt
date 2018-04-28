# Generated by binpac_quickstart

refine flow MQTT_Flow += {
	function proc_mqtt_message(msg: MQTT_PDU): bool
		%{

     		if (${msg.msg_type} == MQTT_CONNECT) {
			vector<MQTT_connect*>* options = ${msg.conn_packet};
			vector<MQTT_connect*>::const_iterator ptr;
			StringVal* protocol_name = 0;
  			string willtopic, willmsg, willuname, willpass;
			int protocol_version = 0;
			int connect_flags = 0;
			uint16 keep_alive = 0;
			int clean_session = 0;
			StringVal* client_id = 0;

			for ( ptr = options->begin(); ptr != options->end(); ++ptr ) {
				protocol_name = new StringVal((*ptr)->protocol_name().length(),
					  (const char*) (*ptr)->protocol_name().begin()); 
				protocol_version = (int)(*ptr)->protocol_version();
				connect_flags = (int)(*ptr)->connect_flags();
				keep_alive = (*ptr)->keep_alive();
			  	client_id = new StringVal((*ptr)->client_id().length(),
					  (const char*) (*ptr)->client_id().begin()); 
  			  	clean_session = (int)(*ptr)->clean_session();
				if ((*ptr)->will()){
					willtopic = std_str((*ptr)->will_objs()->will_topic());
					willmsg = std_str((*ptr)->will_objs()->will_msg());
				}
				if ((*ptr)->username()){
					willuname = std_str((*ptr)->uname_objs()->uname());
				}
				if ((*ptr)->password()){
					willpass = std_str((*ptr)->pass_objs()->pass());
				}
			}

			BifEvent::generate_mqtt_conn(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(), ${msg.msg_type},
						protocol_name, protocol_version, client_id);
			return true;
		}
		if (${msg.msg_type} == MQTT_CONNACK) {
			vector<MQTT_connack*>* connack = ${msg.connack_packet};
			vector<MQTT_connack*>::const_iterator ptr;
			int return_code = -1;
			for ( ptr = connack->begin(); ptr != connack->end(); ++ptr ) {
				return_code = (int)(*ptr)->return_code();
			}
			switch (return_code){ 
				case 0: cout << "Connection Accepted" << endl; break;
				case 1: cout << "Connection Refused: unacceptable protocol version" << endl; break;
				case 2: cout << "Connection Refused: identifier rejected" << endl; break;
				case 3: cout << "Connection Refused: server unavailable" << endl; break;
				case 4: cout << "Connection Refused: bad user name or password" << endl; break;
				case 5: cout << "Connection Refused: not authorized" << endl; break;
			}
			cout << endl;
			BifEvent::generate_mqtt_connack(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(), ${msg.msg_type}, 
									return_code);
			return true;
		}
		if (${msg.msg_type} == MQTT_PUBLISH) {
			vector<MQTT_publish*>* publish = ${msg.pub_packet};
			vector<MQTT_publish*>::const_iterator ptr;
        		StringVal* topic = 0;
        		uint16 msg_id = 0;
        		StringVal* publish_rest = 0;
			for ( ptr = publish->begin(); ptr != publish->end(); ++ptr ) {
				topic = new StringVal((*ptr)->topic().length(),
						  (const char*) (*ptr)->topic().begin());
				msg_id = (*ptr)->msg_id();
				publish_rest = new StringVal((*ptr)->publish_rest().length(),
						  (const char*) (*ptr)->publish_rest().begin());
			}
			BifEvent::generate_mqtt_pub(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(),${msg.msg_type},
							msg_id, topic);
			return true;
		}
                if (${msg.msg_type} == MQTT_PUBACK) {
                        vector<MQTT_puback*>* puback =  ${msg.puback_packet};
                        vector<MQTT_puback*>::const_iterator ptr;
                        uint16 msgid = 0;
                        for ( ptr = puback->begin(); ptr != puback->end(); ++ptr ) {
                                msgid = (*ptr)->msg_id();
                        }
                        BifEvent::generate_mqtt_puback(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(),${msg.msg_type},
                                                        msgid);
                        return true;
                }
		if (${msg.msg_type} == MQTT_SUBSCRIBE) {
			vector<MQTT_subscribe*>* subscribe  = ${msg.subscribe_packet};
			vector<MQTT_subscribe*>::const_iterator ptr;
        		uint16 msgid = 0;
        		StringVal* subscribe_topic = 0;
        		int requested_QoS = 0;
			for ( ptr = subscribe->begin(); ptr != subscribe->end(); ++ptr ) {
				msgid = (*ptr)->msg_id();
	                        vector<MQTT_subscribe_topic*>* sub_options = (*ptr)->topics();
       		                vector<MQTT_subscribe_topic*>::const_iterator ptr1;
				for ( ptr1 = sub_options->begin(); ptr1 != sub_options->end(); ++ptr1 ) {
					subscribe_topic = new StringVal((*ptr1)->subscribe_topic().length(),
						  (const char*) (*ptr1)->subscribe_topic().begin());
					requested_QoS = (int)(*ptr1)->requested_QoS();
				}	
	
			}
			BifEvent::generate_mqtt_sub(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(), ${msg.msg_type},
							msgid, subscribe_topic, requested_QoS);
			return true;
		}
		if (${msg.msg_type} == MQTT_SUBACK) {
			vector<MQTT_suback*>* suback =  ${msg.suback_packet};
			vector<MQTT_suback*>::const_iterator ptr;
        		uint16 msgid = 0;
        		int granted_QoS = 0;
			for ( ptr = suback->begin(); ptr != suback->end(); ++ptr ) {
				msgid = (*ptr)->msg_id();
				granted_QoS = (int)(*ptr)->granted_QoS();
			}
			BifEvent::generate_mqtt_suback(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(),${msg.msg_type},
							msgid, granted_QoS);
			return true;
	 	}
                if (${msg.msg_type} == MQTT_UNSUBSCRIBE) {
                        vector<MQTT_unsubscribe*>* unsubscribe  = ${msg.unsubscribe_packet};
                        vector<MQTT_unsubscribe*>::const_iterator ptr;
                        uint16 msgid = 0;
                        StringVal* unsubscribe_topic = 0;
                        for ( ptr = unsubscribe->begin(); ptr != unsubscribe->end(); ++ptr ) {
                                msgid = (*ptr)->msg_id();
	                        vector<MQTT_unsubscribe_topic*>* unsub_options = (*ptr)->topics();
       		                vector<MQTT_unsubscribe_topic*>::const_iterator ptr1;
				for ( ptr1 = unsub_options->begin(); ptr1 != unsub_options->end(); ++ptr1 ) {
                              		unsubscribe_topic = new StringVal((*ptr1)->unsubscribe_topic().length(),
                                                 (const char*) (*ptr1)->unsubscribe_topic().begin());
				}	
                        }
                        BifEvent::generate_mqtt_unsub(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(), ${msg.msg_type},
                                                        msgid, unsubscribe_topic);
                        return true;
                }
                if (${msg.msg_type} == MQTT_UNSUBACK) {
                        vector<MQTT_unsuback*>* unsuback =  ${msg.unsuback_packet};
                        vector<MQTT_unsuback*>::const_iterator ptr;
                        uint16 msgid = 0;
                        for ( ptr = unsuback->begin(); ptr != unsuback->end(); ++ptr ) {
                                msgid = (*ptr)->msg_id();
                        }
                        BifEvent::generate_mqtt_unsuback(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(), ${msg.msg_type},
                                                        msgid);
                        return true;
                }
		if (${msg.msg_type} == MQTT_PINGREQ) {
			BifEvent::generate_mqtt_pingreq(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(), ${msg.msg_type});
			return true;
		}
		if (${msg.msg_type} == MQTT_PINGRESP) {
			BifEvent::generate_mqtt_pingres(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(), ${msg.msg_type});
			return true;
		}
		if (${msg.msg_type} == MQTT_DISCONNECT) {
			BifEvent::generate_mqtt_disconnect(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(), ${msg.msg_type});
			return true;
		}
		return true;
		%}
};

refine typeattr MQTT_PDU += &let {
	proc: bool = $context.flow.proc_mqtt_message(this);
};