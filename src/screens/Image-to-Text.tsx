import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import DocumentPicker, { pick, types } from "@react-native-documents/picker";

const ImageToText = () => {
    const [selectedFile, setSelectedFile] = useState<any>(null);

    const handlePickFile = async () => {
        try {
            const doc = await pick({
                allowMultiSelection: false,
                type: [
                    types.images, // includes .jpg, .jpeg, .png, .bmp
                    types.pdf,
                    types.doc,
                    types.docx,
                    types.xls,
                ],
            });

            if (doc && doc[0]) {
                const file = doc[0];
                console.log("📄 Selected File:", file);
                setSelectedFile(file);
            }
        } catch (err: any) {
            console.error("File Picker Error:", err);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F8F9FA",
            }}
        >
            <TouchableOpacity
                onPress={handlePickFile}
                style={{
                    backgroundColor: "#007BFF",
                    padding: 14,
                    borderRadius: 8,
                }}
            >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                    📂 Choose File
                </Text>
            </TouchableOpacity>

            {selectedFile && (
                <View style={{ marginTop: 20, alignItems: "center" }}>
                    {selectedFile.type?.startsWith("image/") ? (
                        <Image
                            source={{ uri: selectedFile.uri }}
                            style={{
                                width: 200,
                                height: 200,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: "#ccc",
                            }}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text style={{ color: "#333" }}>{selectedFile.name}</Text>
                    )}
                </View>
            )}
        </View>
    );
};

export default ImageToText;
