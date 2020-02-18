import React, { Component } from "react";
import {
    View,
    ScrollView,
    FlatList,
    Animated,
    RefreshControl,
    TextInput,
    TouchableOpacity
} from "react-native";
import { BaseStyle, BaseColor, Images } from "@config";
import {
    Header,
    SafeAreaView,
    Icon,
    Text,
    StarRating,
    Tag,
    Image,
    RateDetail,
    CommentItem,
    PlaceItem,
    CardList,
    Button
} from "@components";
import { TabView, TabBar } from "react-native-tab-view";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Utils from "@utils";
import styles from "./styles";

// Load sample data
import { PlaceListData, ReviewData } from "@data";

export default class PlaceDetail extends Component {
    constructor(props) {
        super(props);

        // Temp data define
        this.state = {
            collapseHour: true,
            index: 0,
            routes: [
                { key: "information", title: "Information" },
                { key: "review", title: "Review" },
                { key: "feedback", title: "Feedback" },
                { key: "map", title: "Map" }
            ],
            heightHeader: Utils.heightHeader(),
            tabHeightSize: Utils.heightTabView(),
            information: [
                {
                    id: "1",
                    icon: "map-marker-alt",
                    title: "Address",
                    information: "667 Wiegand Gardens Suite, United States"
                },
                {
                    id: "2",
                    icon: "mobile-alt",
                    title: "Tel",
                    information: "+903 9802-7892"
                },
                {
                    id: "3",
                    icon: "envelope",
                    title: "Email",
                    information: "liststar@passionui.com"
                },
                {
                    id: "4",
                    icon: "globe",
                    title: "Website",
                    information: "www.passionui.com"
                }
            ],
            workHours: [
                { id: "1", date: "Monday", hour: "09:0 AM - 18:00 PM" },
                { id: "2", date: "Tuesday", hour: "09:0 AM - 18:00 PM" },
                { id: "3", date: "Wednesday", hour: "09:0 AM - 18:00 PM" },
                { id: "4", date: "Thursday", hour: "09:0 AM - 18:00 PM" },
                { id: "5", date: "Friday", hour: "09:0 AM - 18:00 PM" },
                { id: "6", date: "Saturday", hour: "Close" },
                { id: "7", date: "Sunday", hour: "Close" }
            ]
        };
        this._deltaY = new Animated.Value(0);
    }

    // When tab is activated, set what's index value
    _handleIndexChange = index =>
        this.setState({
            index
        });

    // Customize UI tab bar
    _renderTabBar = props => (
        <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={styles.indicator}
            style={styles.tabbar}
            tabStyle={styles.tab}
            inactiveColor={BaseColor.grayColor}
            activeColor={BaseColor.textPrimaryColor}
            renderLabel={({ route, focused, color }) => (
                <View style={{ flex: 1, width: 130, alignItems: "center" }}>
                    <Text headline semibold={focused} style={{ color }}>
                        {route.title}
                    </Text>
                </View>
            )}
        />
    );

    // Render correct screen container when tab is activated
    _renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case "information":
                return (
                    <InformationTab
                        jumpTo={jumpTo}
                        navigation={this.props.navigation}
                    />
                );
            case "feedback":
                return (
                    <Feedback
                        jumpTo={jumpTo}
                        navigation={this.props.navigation}
                    />
                );
            case "map":
                return (
                    <Map jumpTo={jumpTo} navigation={this.props.navigation} />
                );
            case "review":
                return (
                    <ReviewTab
                        jumpTo={jumpTo}
                        navigation={this.props.navigation}
                    />
                );
        }
    };

    onCollapse() {
        Utils.enableExperimental();
        this.setState({
            collapseHour: !this.state.collapseHour
        });
    }

    render() {
        const { navigation } = this.props;
        const {
            heightHeader,
            tabHeightSize,
            information,
            workHours,
            collapseHour
        } = this.state;
        const heightImageBanner = Utils.scaleWithPixel(250, 1);
        return (
            <View style={{ flex: 1 }}>
                <Animated.View
                    style={[
                        styles.imgBanner,
                        {
                            height: this._deltaY.interpolate({
                                inputRange: [
                                    0,
                                    Utils.scaleWithPixel(140),
                                    Utils.scaleWithPixel(140)
                                ],
                                outputRange: [
                                    heightImageBanner,
                                    heightHeader,
                                    heightHeader
                                ]
                            })
                        }
                    ]}
                >
                    <Image source={Images.location7} style={{ flex: 1 }} />
                    <Animated.View
                        style={{
                            position: "absolute",
                            bottom: 15,
                            left: 20,
                            flexDirection: "row",
                            opacity: this._deltaY.interpolate({
                                inputRange: [
                                    0,
                                    Utils.scaleWithPixel(140),
                                    Utils.scaleWithPixel(140)
                                ],
                                outputRange: [1, 0, 0]
                            })
                        }}
                    >
                        <Image
                            source={Images.profile2}
                            style={styles.userIcon}
                        />
                        <View>
                            <Text headline semibold whiteColor>
                                Steve Garrett
                            </Text>
                            <Text footnote whiteColor>
                                5 hours ago | 100k views
                            </Text>
                        </View>
                    </Animated.View>
                </Animated.View>

                <SafeAreaView
                    style={BaseStyle.safeAreaView}
                    forceInset={{ top: "always" }}
                >
                    {/* Header */}
                    <Header
                        title=""
                        renderLeft={() => {
                            return (
                                <Icon
                                    name="arrow-left"
                                    size={20}
                                    color={BaseColor.whiteColor}
                                />
                            );
                        }}
                        renderRight={() => {
                            return (
                                <Icon
                                    name="images"
                                    size={20}
                                    color={BaseColor.whiteColor}
                                />
                            );
                        }}
                        onPressLeft={() => {
                            navigation.goBack();
                        }}
                        onPressRight={() => {
                            navigation.navigate("PreviewImage");
                        }}
                    />
                    <ScrollView
                        onScroll={Animated.event([
                            {
                                nativeEvent: {
                                    contentOffset: { y: this._deltaY }
                                }
                            }
                        ])}
                        onContentSizeChange={() => {
                            this.setState({
                                heightHeader: Utils.heightHeader(),
                                tabHeightSize: Utils.heightTabView()
                            });
                        }}
                        scrollEventThrottle={8}
                    >
                        <View style={{ height: 255 - heightHeader }} />
                        <View
                            style={{
                                paddingHorizontal: 20,
                                marginBottom: 20
                            }}
                        >
                            <View style={styles.lineSpace}>
                                <Text title1 semibold>
                                    Lounge Coffee Bar
                                </Text>
                                <Icon
                                    name="heart"
                                    color={BaseColor.lightPrimaryColor}
                                    size={24}
                                />
                            </View>
                            <View style={styles.lineSpace}>
                                <View>
                                    <Text caption1 grayColor>
                                        Arts & Humanities
                                    </Text>
                                    <View style={styles.rateLine}>
                                        <Tag
                                            rateSmall
                                            style={{ marginRight: 5 }}
                                        >
                                            4.5
                                        </Tag>
                                        <StarRating
                                            disabled={true}
                                            starSize={10}
                                            maxStars={5}
                                            rating={4.5}
                                            fullStarColor={
                                                BaseColor.yellowColor
                                            }
                                        />
                                        <Text
                                            footnote
                                            grayColor
                                            style={{ marginLeft: 5 }}
                                        >
                                            (609)
                                        </Text>
                                    </View>
                                </View>
                                <Tag status>Featured</Tag>
                            </View>
                            {information.map(item => {
                                return (
                                    <View style={styles.line} key={item.id}>
                                        <View style={styles.contentIcon}>
                                            <Icon
                                                name={item.icon}
                                                size={16}
                                                color={BaseColor.whiteColor}
                                            />
                                        </View>
                                        <View style={{ marginLeft: 10 }}>
                                            <Text caption2 grayColor>
                                                {item.title}
                                            </Text>
                                            <Text
                                                footnote
                                                semibold
                                                style={{ marginTop: 5 }}
                                            >
                                                {item.information}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}

                            <View style={styles.line}>
                                <View style={styles.contentIcon}>
                                    <Icon
                                        name="clock"
                                        size={16}
                                        color={BaseColor.whiteColor}
                                    />
                                </View>
                                <View style={styles.contentInforAction}>
                                    <View>
                                        <Text caption2 grayColor>
                                            Open Hours
                                        </Text>
                                        <Text
                                            footnote
                                            semibold
                                            style={{ marginTop: 5 }}
                                        >
                                            09:00 AM - 18:00 PM
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this.onCollapse()}
                                    >
                                        <Icon
                                            name={
                                                collapseHour
                                                    ? "angle-up"
                                                    : "angle-down"
                                            }
                                            size={24}
                                            color={BaseColor.grayColor}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View
                                style={{
                                    paddingLeft: 40,
                                    paddingRight: 20,
                                    marginTop: 5,
                                    height: collapseHour ? 0 : null,
                                    overflow: "hidden"
                                }}
                            >
                                {workHours.map(item => {
                                    return (
                                        <View
                                            style={styles.lineWorkHours}
                                            key={item.id}
                                        >
                                            <Text body2 grayColor>
                                                {item.date}
                                            </Text>
                                            <Text body2 accentColor semibold>
                                                {item.hour}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                        <View
                            style={{
                                height: tabHeightSize
                            }}
                        >
                            <TabView
                                lazy
                                swipeEnabled={true}
                                navigationState={this.state}
                                renderScene={this._renderScene}
                                renderTabBar={this._renderTabBar}
                                onIndexChange={this._handleIndexChange}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
}

/**
 * @description Show when tab Information activated
 * @author Passion UI <passionui.com>
 * @date 2019-09-01
 * @class PreviewTab
 * @extends {Component}
 */
class InformationTab extends Component {
    constructor(props) {
        super();
        this.state = {
            list: PlaceListData,
            relate: PlaceListData.slice(2, 4),
            facilities: [
                { id: "1", icon: "wifi", name: "Free Wifi", checked: true },
                { id: "2", icon: "bath", name: "Shower" },
                { id: "3", icon: "paw", name: "Pet Allowed" },
                { id: "4", icon: "bus", name: "Shuttle Bus" },
                { id: "5", icon: "cart-plus", name: "Supper Market" },
                { id: "6", icon: "clock", name: "Open 24/7" }
            ]
        };
    }

    render() {
        const { list, relate, facilities } = this.state;
        const { navigation } = this.props;
        return (
            <ScrollView>
                <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
                    <Text body2 style={{ lineHeight: 20 }}>
                        Donec rutrum congue leo eget malesuada. Vivamus suscipit
                        tortor eget felis porttitor volutpat. Sed porttitor
                        lectus nibh. Nulla quis lorem ut libero malesuada
                        feugiat. Quisque velit nisi, pretium ut lacinia in,
                        elementum id enim.
                    </Text>
                    <View
                        style={{
                            paddingVertical: 20,
                            flexDirection: "row",
                            borderBottomWidth: 1,
                            borderColor: BaseColor.textSecondaryColor
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text caption1 grayColor>
                                Date Established
                            </Text>
                            <Text headline style={{ marginTop: 5 }}>
                                Sep 26, 2009
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text caption1 grayColor>
                                Price Range
                            </Text>
                            <Text headline style={{ marginTop: 5 }}>
                                $46.00 to $93.00
                            </Text>
                        </View>
                    </View>
                </View>
                <Text
                    title3
                    semibold
                    style={{
                        paddingHorizontal: 20,
                        paddingTop: 15,
                        paddingBottom: 5
                    }}
                >
                    Facilities
                </Text>
                <View style={styles.wrapContent}>
                    {facilities.map(item => {
                        return (
                            <Tag
                                icon={
                                    <Icon
                                        name={item.icon}
                                        size={12}
                                        color={BaseColor.accentColor}
                                        solid
                                        style={{ marginRight: 5 }}
                                    />
                                }
                                chip
                                key={item.id}
                                style={{
                                    marginTop: 10,
                                    marginRight: 10
                                }}
                            >
                                {item.name}
                            </Tag>
                        );
                    })}
                </View>
                <Text
                    title3
                    semibold
                    style={{ paddingHorizontal: 20, paddingVertical: 15 }}
                >
                    Featured
                </Text>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={list}
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
                            onPress={() => navigation.navigate("PlaceDetail")}
                            style={{ marginLeft: 20 }}
                        />
                    )}
                />
                <Text
                    title3
                    semibold
                    style={{ paddingHorizontal: 20, paddingVertical: 15 }}
                >
                    Related
                </Text>
                <FlatList
                    contentContainerStyle={{
                        marginHorizontal: 20
                    }}
                    data={relate}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) => (
                        <CardList
                            image={item.image}
                            title={item.title}
                            subtitle={item.subtitle}
                            rate={item.rate}
                            style={{ marginBottom: 20 }}
                            onPress={() => navigation.navigate("PlaceDetail")}
                        />
                    )}
                />
            </ScrollView>
        );
    }
}

/**
 * @description Show when tab Feedback activated
 * @author Passion UI <passionui.com>
 * @date 2019-09-01
 * @class PreviewTab
 * @extends {Component}
 */
class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rate: 4.5,
            title: "",
            review: ""
        };
    }

    render() {
        const { rate, title, review } = this.state;
        return (
            <View style={{ alignItems: "center", padding: 20 }}>
                <View style={{ width: 160 }}>
                    <StarRating
                        starSize={26}
                        maxStars={5}
                        rating={rate}
                        selectedStar={rating => {
                            this.setState({ rate: rating });
                        }}
                        fullStarColor={BaseColor.yellowColor}
                        containerStyle={{ padding: 5 }}
                    />
                    <Text caption1 grayColor style={{ textAlign: "center" }}>
                        Tap a star to rate
                    </Text>
                </View>
                <TextInput
                    style={[BaseStyle.textInput, { marginTop: 10 }]}
                    onChangeText={text => this.setState({ title: text })}
                    autoCorrect={false}
                    placeholder="Title"
                    placeholderTextColor={BaseColor.grayColor}
                    value={title}
                    selectionColor={BaseColor.primaryColor}
                />
                <TextInput
                    style={[
                        BaseStyle.textInput,
                        { marginTop: 20, height: 140 }
                    ]}
                    onChangeText={text => this.setState({ review: text })}
                    textAlignVertical="top"
                    multiline={true}
                    autoCorrect={false}
                    placeholder="Reviews"
                    placeholderTextColor={BaseColor.grayColor}
                    value={review}
                    selectionColor={BaseColor.primaryColor}
                />
                <Button full style={{ marginTop: 20 }} onPress={() => {}}>
                    Sent
                </Button>
            </View>
        );
    }
}

/**
 * @description Show when tab Map activated
 * @author Passion UI <passionui.com>
 * @date 2019-09-01
 * @class PreviewTab
 * @extends {Component}
 */
class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 1.352083,
                longitude: 103.819839,
                latitudeDelta: 0.009,
                longitudeDelta: 0.004
            }
        };
    }

    render() {
        return (
            <ScrollView>
                <View style={{ height: 180, margin: 20 }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={this.state.region}
                        onRegionChange={() => {}}
                    >
                        <Marker
                            coordinate={{
                                latitude: 1.352083,
                                longitude: 103.819839
                            }}
                        />
                    </MapView>
                </View>
            </ScrollView>
        );
    }
}

/**
 * @description Show when tab Review activated
 * @author Passion UI <passionui.com>
 * @date 2019-09-01
 * @class PreviewTab
 * @extends {Component}
 */
class ReviewTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rateDetail: {
                point: 4.7,
                maxPoint: 5,
                totalRating: 25,
                data: ["80%", "10%", "10%", "0%", "0%"]
            },
            reviewList: [
                {
                    id: "1",
                    source: Images.profile3,
                    name: "Grigoriy Kozhukhov",
                    rate: 4,
                    date: "Jun 2018",
                    title: "Nice Place",
                    comment:
                        "Lorem ipsum dolor purus in efficitur aliquam, enim enim porttitor lacus, ut sollicitudin nibh neque in metus. adipiscing elit. Aliqam at turpis orci. Mauris nisl, in mollis acu  tincidunt. neque nec turpis aliquet, ut ornare velit molestie. "
                },
                {
                    id: "2",
                    source: Images.profile4,
                    name: "Ea Tipene",
                    rate: 4,
                    date: "Jun 2018",
                    title: "Great for families",
                    comment:
                        "Lorem ipsum dolor adipiscing elit. Aliquam at turpis orci. Mauris nisl, in mollis arcu  tincidunt. Integer consectetur neque nec turpis aliquet, ut ornare velit molestie. Suspendisse sagittis, justo sit amet consectetur maximus"
                }
            ]
        };
    }

    render() {
        let { rateDetail, reviewList } = this.state;
        return (
            <FlatList
                style={{ padding: 20 }}
                refreshControl={
                    <RefreshControl
                        colors={[BaseColor.primaryColor]}
                        tintColor={BaseColor.primaryColor}
                        refreshing={this.state.refreshing}
                        onRefresh={() => {}}
                    />
                }
                data={reviewList}
                keyExtractor={(item, index) => item.id}
                ListHeaderComponent={() => (
                    <RateDetail
                        point={rateDetail.point}
                        maxPoint={rateDetail.maxPoint}
                        totalRating={rateDetail.totalRating}
                        data={rateDetail.data}
                    />
                )}
                renderItem={({ item }) => (
                    <CommentItem
                        style={{ marginTop: 10 }}
                        image={item.source}
                        name={item.name}
                        rate={item.rate}
                        date={item.date}
                        title={item.title}
                        comment={item.comment}
                    />
                )}
            />
        );
    }
}
