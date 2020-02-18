import React, { Component } from "react";
import {
    FlatList,
    RefreshControl,
    View,
    Animated,
    Platform
} from "react-native";
import { BaseStyle, BaseColor, Images } from "@config";
import { Header, SafeAreaView, Icon, PlaceItem, FilterSort } from "@components";
import styles from "./styles";
import * as Utils from "@utils";

// Load sample data
import { PlaceListData } from "@data";

export default class Place extends Component {
    constructor(props) {
        super(props);
        const scrollAnim = new Animated.Value(0);
        const offsetAnim = new Animated.Value(0);

        this.state = {
            refreshing: false,
            modeView: "block",
            list: PlaceListData,
            scrollAnim,
            offsetAnim,
            clampedScroll: Animated.diffClamp(
                Animated.add(
                    scrollAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                        extrapolateLeft: "clamp"
                    }),
                    offsetAnim
                ),
                0,
                40
            )
        };
        this.onChangeView = this.onChangeView.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onChangeSort = this.onChangeSort.bind(this);
    }

    onChangeSort() {}

    /**
     * @description Open modal when filterring mode is applied
     * @author Passion UI <passionui.com>
     * @date 2019-09-01
     */
    onFilter() {
        const { navigation } = this.props;
        navigation.navigate("Filter");
    }

    /**
     * @description Open modal when view mode is pressed
     * @author Passion UI <passionui.com>
     * @date 2019-09-01
     */
    onChangeView() {
        let { modeView } = this.state;
        Utils.enableExperimental();
        switch (modeView) {
            case "block":
                this.setState({
                    modeView: "grid"
                });
                break;
            case "grid":
                this.setState({
                    modeView: "list"
                });
                break;
            case "list":
                this.setState({
                    modeView: "block"
                });
                break;
            default:
                this.setState({
                    modeView: "block"
                });
                break;
        }
    }

    /**
     * @description Render container view
     * @author Passion UI <passionui.com>
     * @date 2019-09-01
     * @returns
     */
    renderContent() {
        const { modeView, list, refreshing, clampedScroll } = this.state;
        const { navigation } = this.props;
        const navbarTranslate = clampedScroll.interpolate({
            inputRange: [0, 40],
            outputRange: [0, -40],
            extrapolate: "clamp"
        });
        const android = Platform.OS == "android";
        switch (modeView) {
            case "block":
                return (
                    <View style={{ flex: 1 }}>
                        <Animated.FlatList
                            contentInset={{ top: 50 }}
                            contentContainerStyle={{
                                marginTop: android ? 50 : 0
                            }}
                            refreshControl={
                                <RefreshControl
                                    colors={[BaseColor.primaryColor]}
                                    tintColor={BaseColor.primaryColor}
                                    refreshing={refreshing}
                                    onRefresh={() => {}}
                                />
                            }
                            scrollEventThrottle={1}
                            onScroll={Animated.event(
                                [
                                    {
                                        nativeEvent: {
                                            contentOffset: {
                                                y: this.state.scrollAnim
                                            }
                                        }
                                    }
                                ],
                                { useNativeDriver: true }
                            )}
                            data={list}
                            key={"block"}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({ item, index }) => (
                                <PlaceItem
                                    block
                                    image={item.image}
                                    title={item.title}
                                    subtitle={item.subtitle}
                                    location={item.location}
                                    phone={item.phone}
                                    rate={item.rate}
                                    status={item.status}
                                    rateStatus={item.rateStatus}
                                    numReviews={item.numReviews}
                                    style={{
                                        borderBottomWidth: 0.5,
                                        borderColor:
                                            BaseColor.textSecondaryColor,
                                        marginBottom: 10
                                    }}
                                    onPress={() =>
                                        navigation.navigate("PlaceDetail")
                                    }
                                />
                            )}
                        />
                        <Animated.View
                            style={[
                                styles.navbar,
                                { transform: [{ translateY: navbarTranslate }] }
                            ]}
                        >
                            <FilterSort
                                modeView={modeView}
                                onChangeSort={this.onChangeSort}
                                onChangeView={this.onChangeView}
                                onFilter={this.onFilter}
                            />
                        </Animated.View>
                    </View>
                );
            case "grid":
                return (
                    <View style={{ flex: 1 }}>
                        <Animated.FlatList
                            contentInset={{ top: 50 }}
                            contentContainerStyle={{
                                marginTop: android ? 50 : 0
                            }}
                            columnWrapperStyle={{
                                marginHorizontal: 20
                            }}
                            refreshControl={
                                <RefreshControl
                                    colors={[BaseColor.primaryColor]}
                                    tintColor={BaseColor.primaryColor}
                                    refreshing={refreshing}
                                    onRefresh={() => {}}
                                />
                            }
                            scrollEventThrottle={1}
                            onScroll={Animated.event(
                                [
                                    {
                                        nativeEvent: {
                                            contentOffset: {
                                                y: this.state.scrollAnim
                                            }
                                        }
                                    }
                                ],
                                { useNativeDriver: true }
                            )}
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                            data={list}
                            key={"gird"}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({ item, index }) => (
                                <PlaceItem
                                    grid
                                    image={item.image}
                                    title={item.title}
                                    subtitle={item.subtitle}
                                    location={item.location}
                                    phone={item.phone}
                                    rate={item.rate}
                                    status={item.status}
                                    rateStatus={item.rateStatus}
                                    numReviews={item.numReviews}
                                    style={
                                        index % 2 == 0
                                            ? {
                                                  marginBottom: 20
                                              }
                                            : {
                                                  marginLeft: 15,
                                                  marginBottom: 20
                                              }
                                    }
                                    onPress={() =>
                                        navigation.navigate("PlaceDetail")
                                    }
                                />
                            )}
                        />
                        <Animated.View
                            style={[
                                styles.navbar,
                                {
                                    transform: [{ translateY: navbarTranslate }]
                                }
                            ]}
                        >
                            <FilterSort
                                modeView={modeView}
                                onChangeSort={this.onChangeSort}
                                onChangeView={this.onChangeView}
                                onFilter={this.onFilter}
                            />
                        </Animated.View>
                    </View>
                );

            case "list":
                return (
                    <View style={{ flex: 1 }}>
                        <Animated.FlatList
                            style={{ paddingHorizontal: 20 }}
                            contentInset={{ top: 50 }}
                            contentContainerStyle={{
                                marginTop: android ? 50 : 0
                            }}
                            refreshControl={
                                <RefreshControl
                                    colors={[BaseColor.primaryColor]}
                                    tintColor={BaseColor.primaryColor}
                                    refreshing={refreshing}
                                    onRefresh={() => {}}
                                />
                            }
                            scrollEventThrottle={1}
                            onScroll={Animated.event(
                                [
                                    {
                                        nativeEvent: {
                                            contentOffset: {
                                                y: this.state.scrollAnim
                                            }
                                        }
                                    }
                                ],
                                { useNativeDriver: true }
                            )}
                            data={list}
                            key={"list"}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({ item, index }) => (
                                <PlaceItem
                                    list
                                    image={item.image}
                                    title={item.title}
                                    subtitle={item.subtitle}
                                    location={item.location}
                                    phone={item.phone}
                                    rate={item.rate}
                                    status={item.status}
                                    rateStatus={item.rateStatus}
                                    numReviews={item.numReviews}
                                    style={{
                                        marginBottom: 20
                                    }}
                                    onPress={() =>
                                        navigation.navigate("PlaceDetail")
                                    }
                                />
                            )}
                        />
                        <Animated.View
                            style={[
                                styles.navbar,
                                {
                                    transform: [{ translateY: navbarTranslate }]
                                }
                            ]}
                        >
                            <FilterSort
                                modeView={modeView}
                                onChangeSort={this.onChangeSort}
                                onChangeView={this.onChangeView}
                                onFilter={this.onFilter}
                            />
                        </Animated.View>
                    </View>
                );
            default:
                return (
                    <View style={{ flex: 1 }}>
                        <Animated.FlatList
                            contentInset={{ top: 50 }}
                            contentContainerStyle={{
                                marginTop: android ? 50 : 0
                            }}
                            refreshControl={
                                <RefreshControl
                                    colors={[BaseColor.primaryColor]}
                                    tintColor={BaseColor.primaryColor}
                                    refreshing={refreshing}
                                    onRefresh={() => {}}
                                />
                            }
                            scrollEventThrottle={1}
                            onScroll={Animated.event(
                                [
                                    {
                                        nativeEvent: {
                                            contentOffset: {
                                                y: this.state.scrollAnim
                                            }
                                        }
                                    }
                                ],
                                { useNativeDriver: true }
                            )}
                            data={list}
                            key={"block"}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({ item, index }) => (
                                <PlaceItem
                                    block
                                    image={item.image}
                                    title={item.title}
                                    subtitle={item.subtitle}
                                    location={item.location}
                                    phone={item.phone}
                                    rate={item.rate}
                                    status={item.status}
                                    rateStatus={item.rateStatus}
                                    numReviews={item.numReviews}
                                    style={{
                                        borderBottomWidth: 0.5,
                                        borderColor:
                                            BaseColor.textSecondaryColor,
                                        marginBottom: 10
                                    }}
                                    onPress={() =>
                                        navigation.navigate("PlaceDetail")
                                    }
                                />
                            )}
                        />
                        <Animated.View
                            style={[
                                styles.navbar,
                                { transform: [{ translateY: navbarTranslate }] }
                            ]}
                        >
                            <FilterSort
                                modeView={modeView}
                                onChangeSort={this.onChangeSort}
                                onChangeView={this.onChangeView}
                                onFilter={this.onFilter}
                            />
                        </Animated.View>
                    </View>
                );
                break;
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView
                style={BaseStyle.safeAreaView}
                forceInset={{ top: "always" }}
            >
                <Header
                    title="Place"
                    renderRight={() => {
                        return (
                            <Icon
                                name="search"
                                size={20}
                                color={BaseColor.primaryColor}
                            />
                        );
                    }}
                    onPressLeft={() => {
                        navigation.goBack();
                    }}
                    onPressRight={() => {
                        navigation.navigate("SearchHistory");
                    }}
                />
                {this.renderContent()}
            </SafeAreaView>
        );
    }
}
