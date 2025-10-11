import React, { useState } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    Modal,
    Pressable,
    StyleSheet,
} from "react-native";
import LanguageIcon from "../assets/Language.svg";
import HindiIcon from "../assets/Hindi.svg";
import TeluguIcon from "../assets/Telugu.svg";
import EnglishIcon from "../assets/English.svg";

export const getHeaderRight = () => {
    return <LanguageSelector />;
};

const LanguageSelector = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleLanguageSelect = (lang: string) => {
        console.log(`${lang} selected`);
        setModalVisible(false);
    };

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>

            {/* Language Button */}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <LanguageIcon width={30} height={30} />
            </TouchableOpacity>

            {/* Popup Modal */}
            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={styles.overlay}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.title}>Choose Language</Text>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleLanguageSelect("English")}
                        >
                            <EnglishIcon width={24} height={24} />
                            <Text style={styles.optionText}>English</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleLanguageSelect("Hindi")}
                        >
                            <HindiIcon width={24} height={24} />
                            <Text style={styles.optionText}>Hindi</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleLanguageSelect("Telugu")}
                        >
                            <TeluguIcon width={24} height={24} />
                            <Text style={styles.optionText}>Telugu</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        width: 250,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 15,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    optionText: {
        fontSize: 16,
        marginLeft: 10,
    },
});
