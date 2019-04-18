
/*********************app系统功能**********************/
--YZMDCountry
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZMDCountry]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[YZMDCountry] (
	[Name] [nvarchar](50) NULL,
	[Name_en] [nvarchar](50) NULL,
	[IDDCode] [nvarchar](50) NULL
) ON [PRIMARY]
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'安哥拉',N'Angola',N'244')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'阿富汗',N'Afghanistan',N'93')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'阿尔巴尼亚',N'Albania',N'335')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'阿尔及利亚',N'Algeria',N'213')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'安道尔共和国',N'Andorra',N'376')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'安圭拉岛',N'Anguilla',N'1254')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'安提瓜和巴布达',N'Antigua and Barbuda',N'1268')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'阿根廷',N'Argentina',N'54')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'亚美尼亚',N'Armenia',N'374')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'阿森松',N'Ascension',N'247')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'澳大利亚',N'Australia',N'61')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'奥地利',N'Austria',N'43')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'阿塞拜疆',N'Azerbaijan',N'994')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'巴哈马',N'Bahamas',N'1242')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'巴林',N'Bahrain',N'973')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'孟加拉国',N'Bangladesh',N'880')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'巴巴多斯',N'Barbados',N'1246')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'白俄罗斯',N'Belarus',N'375')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'比利时',N'Belgium',N'32')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'伯利兹',N'Belize',N'501')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'贝宁',N'Benin',N'229')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'百慕大群岛',N'Bermuda Is',N'1441')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'玻利维亚',N'Bolivia',N'591')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'博茨瓦纳',N'Botswana',N'267')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'巴西',N'Brazil',N'55')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'文莱',N'Brunei',N'673')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'保加利亚',N'Bulgaria',N'359')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'布基纳法索',N'Burkina Faso',N'226')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'缅甸',N'Burma',N'95')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'布隆迪',N'Burundi',N'257')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'喀麦隆',N'Cameroon',N'237')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'加拿大',N'Canada',N'1')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'开曼群岛',N'Cayman Is',N'1345')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'中非共和国',N'Central African Republic',N'236')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'乍得',N'Chad',N'235')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'智利',N'Chile',N'56')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'中国',N'China',N'86')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'哥伦比亚',N'Colombia',N'57')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'刚果',N'Congo',N'242')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'库克群岛',N'Cook Is',N'682')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'哥斯达黎加',N'Costa Rica',N'506')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'古巴',N'Cuba',N'53')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'塞浦路斯',N'Cyprus',N'357')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'捷克',N'Czech Republic',N'420')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'丹麦',N'Denmark',N'45')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'吉布提',N'Djibouti',N'253')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'多米尼加共和国',N'Dominica Rep',N'1890')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'厄瓜多尔',N'Ecuador',N'593')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'埃及',N'Egypt',N'20')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'萨尔瓦多',N'EI Salvador',N'503')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'爱沙尼亚',N'Estonia',N'372')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'埃塞俄比亚',N'Ethiopia',N'251')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'斐济',N'Fiji',N'679')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'芬兰',N'Finland',N'358')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'法国',N'France',N'33')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'法属圭亚那',N'French Guiana',N'594')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'法属玻利尼西亚',N'French Polynesia',N'689')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'加蓬',N'Gabon',N'241')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'冈比亚',N'Gambia',N'220')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'格鲁吉亚',N'Georgia',N'995')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'德国',N'Germany',N'49')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'加纳',N'Ghana',N'233')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'直布罗陀',N'Gibraltar',N'350')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'希腊',N'Greece',N'30')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'格林纳达',N'Grenada',N'1809')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'关岛',N'Guam',N'1671')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'危地马拉',N'Guatemala',N'502')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'几内亚',N'Guinea',N'224')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'圭亚那',N'Guyana',N'592')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'海地',N'Haiti',N'509')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'洪都拉斯',N'Honduras',N'504')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'香港（中国）',N'Hongkong',N'852')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'匈牙利',N'Hungary',N'36')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'冰岛',N'Iceland',N'354')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'印度',N'India',N'91')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'印度尼西亚',N'Indonesia',N'62')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'伊朗',N'Iran',N'98')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'伊拉克',N'Iraq',N'964')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'爱尔兰',N'Ireland',N'353')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'以色列',N'Israel',N'972')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'意大利',N'Italy',N'39')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'科特迪瓦',N'Ivory Coast',N'225')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'牙买加',N'Jamaica',N'1876')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'日本',N'Japan',N'81')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'约旦',N'Jordan',N'962')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'柬埔寨',N'Kampuchea (Cambodia )',N'855')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'哈萨克斯坦',N'Kazakstan',N'327')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'肯尼亚',N'Kenya',N'254')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'韩国',N'Korea',N'82')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'科威特',N'Kuwait',N'965')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'吉尔吉斯坦',N'Kyrgyzstan',N'331')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'老挝',N'Laos',N'856')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'拉脱维亚',N'Latvia',N'371')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'黎巴嫩',N'Lebanon',N'961')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'莱索托',N'Lesotho',N'266')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'利比里亚',N'Liberia',N'231')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'利比亚',N'Libya',N'218')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'列支敦士登',N'Liechtenstein',N'423')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'立陶宛',N'Lithuania',N'370')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'卢森堡',N'Luxembourg',N'352')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'澳门',N'Macao',N'853')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'马达加斯加',N'Madagascar',N'261')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'马拉维',N'Malawi',N'265')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'马来西亚',N'Malaysia',N'60')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'马尔代夫',N'Maldives',N'960')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'马里',N'Mali',N'223')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'马耳他',N'Malta',N'356')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'马里亚那群岛',N'Mariana Is',N'1670')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'马提尼克',N'Martinique',N'596')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'毛里求斯',N'Mauritius',N'230')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'墨西哥',N'Mexico',N'52')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'摩尔多瓦',N'Moldova',N'373')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'摩纳哥',N'Monaco',N'377')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'蒙古',N'Mongolia',N'976')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'蒙特塞拉特岛',N'Montserrat Is',N'1664')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'摩洛哥',N'Morocco',N'212')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'莫桑比克',N'Mozambique',N'258')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'纳米比亚',N'Namibia',N'264')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'瑙鲁',N'Nauru',N'674')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'尼泊尔',N'Nepal',N'977')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'荷属安的列斯',N'Netheriands Antilles',N'599')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'荷兰',N'Netherlands',N'31')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'新西兰',N'New Zealand',N'64')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'尼加拉瓜',N'Nicaragua',N'505')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'尼日尔',N'Niger',N'227')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'尼日利亚',N'Nigeria',N'234')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'朝鲜',N'North Korea',N'850')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'挪威',N'Norway',N'47')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'阿曼',N'Oman',N'968')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'巴基斯坦',N'Pakistan',N'92')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'巴拿马',N'Panama',N'507')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'巴布亚新几内亚',N'Papua New Cuinea',N'675')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'巴拉圭',N'Paraguay',N'595')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'秘鲁',N'Peru',N'51')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'菲律宾',N'Philippines',N'63')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'波兰',N'Poland',N'48')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'葡萄牙',N'Portugal',N'351')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'波多黎各',N'Puerto Rico',N'1787')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'卡塔尔',N'Qatar',N'974')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'留尼旺',N'Reunion',N'262')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'罗马尼亚',N'Romania',N'40')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'俄罗斯',N'Russia',N'7')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'圣卢西亚',N'Saint Lueia',N'1758')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'圣文森特岛',N'Saint Vincent',N'1784')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'东萨摩亚(美)',N'Samoa Eastern',N'684')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'西萨摩亚',N'Samoa Western',N'685')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'圣马力诺',N'San Marino',N'378')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'圣多美和普林西比',N'Sao Tome and Principe',N'239')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'沙特阿拉伯',N'Saudi Arabia',N'966')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'塞内加尔',N'Senegal',N'221')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'塞舌尔',N'Seychelles',N'248')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'塞拉利昂',N'Sierra Leone',N'232')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'新加坡',N'Singapore',N'65')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'斯洛伐克',N'Slovakia',N'421')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'斯洛文尼亚',N'Slovenia',N'386')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'所罗门群岛',N'Solomon Is',N'677')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'索马里',N'Somali',N'252')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'南非',N'South Africa',N'27')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'西班牙',N'Spain',N'34')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'斯里兰卡',N'SriLanka',N'94')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'圣卢西亚',N'St.Lucia',N'1758')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'圣文森特',N'St.Vincent',N'1784')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'苏丹',N'Sudan',N'249')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'苏里南',N'Suriname',N'597')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'斯威士兰',N'Swaziland',N'268')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'瑞典',N'Sweden',N'46')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'瑞士',N'Switzerland',N'41')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'叙利亚',N'Syria',N'963')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'台湾（中国）',N'Taiwan',N'886')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'塔吉克斯坦',N'Tajikstan',N'992')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'坦桑尼亚',N'Tanzania',N'255')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'泰国',N'Thailand',N'66')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'多哥',N'Togo',N'228')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'汤加',N'Tonga',N'676')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'特立尼达和多巴哥',N'Trinidad and Tobago',N'1809')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'突尼斯',N'Tunisia',N'216')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'土耳其',N'Turkey',N'90')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'土库曼斯坦',N'Turkmenistan',N'993')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'乌干达',N'Uganda',N'256')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'乌克兰',N'Ukraine',N'380')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'阿拉伯联合酋长国',N'United Arab Emirates',N'971')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'英国',N'United Kiongdom',N'44')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'美国',N'United States of America',N'1')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'乌拉圭',N'Uruguay',N'598')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'乌兹别克斯坦',N'Uzbekistan',N'233')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'委内瑞拉',N'Venezuela',N'58')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'越南',N'Vietnam',N'84')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'也门',N'Yemen',N'967')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'南斯拉夫',N'Yugoslavia',N'381')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'津巴布韦',N'Zimbabwe',N'263')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'扎伊尔',N'Zaire',N'243')
INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N'赞比亚',N'Zambia',N'260')
END
GO

--YZAppServiceContacts
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppServiceContacts]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[YZAppServiceContacts] (
	[ItemID] [int] IDENTITY(1,1) NOT NULL,
	[Product] [nvarchar](50) NULL,
	[ServiceCenter] [nvarchar](50) NULL,
	[Description] [nvarchar](200) NULL,
	[Tel] [nvarchar](50) NULL,
	[OrderIndex] [int] NULL CONSTRAINT [DF_YZAppServiceContacts_OrderIndex]  DEFAULT ((0)),
	CONSTRAINT [PK_YZAppServiceContacts] PRIMARY KEY CLUSTERED 
	(
		[ItemID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
INSERT INTO YZAppServiceContacts(Product,ServiceCenter,Tel,OrderIndex) VALUES(N'BPM',N'总部客服',N'021-67827788',1)
INSERT INTO YZAppServiceContacts(Product,ServiceCenter,Tel,OrderIndex) VALUES(N'BPM',N'阳江基地',N'010-33669988',2)
INSERT INTO YZAppServiceContacts(Product,ServiceCenter,Tel,OrderIndex) VALUES(N'BPM',N'深圳分公司',N'0755-78820889',3)
INSERT INTO YZAppServiceContacts(Product,ServiceCenter,Tel,OrderIndex) VALUES(N'BPM',N'上海分公司',N'021-87663389',4)
INSERT INTO YZAppServiceContacts(Product,ServiceCenter,Tel,OrderIndex) VALUES(N'BPM',N'北京分公司',N'010-67888996',5)
END
GO

--YZSysSMSValidation
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZSysSMSValidation]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[YZSysSMSValidation] (
	[ItemGUID] [nvarchar](50) NOT NULL,
	[IDDCode] [nvarchar](10) NULL,
	[PhoneNumber] [nvarchar](20) NULL,
	[ValidationCode] [nvarchar](20) NULL,
	[ExpireDate] [datetime] NULL,
	[CreateDate] [datetime] NULL,
	[CreateBy] [nvarchar](50) NULL,
	CONSTRAINT [PK_YZSysSMSValidation] PRIMARY KEY CLUSTERED 
	(
		[ItemGUID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

/**********************app内置应用***********************/
--iDailyReport
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[iDailyReport]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[iDailyReport] (
	[ItemID] [int] IDENTITY(1,1) NOT NULL,
	[TaskID] [int] NULL,
	[SN] [nvarchar](50) NULL,
	[Account] [nvarchar](50) NULL,
	[Date] [datetime] NULL,
	[Done] [nvarchar](200) NULL,
	[Undone] [nvarchar](200) NULL,
	[Coordinate] [nvarchar](200) NULL,
	[Comments] [nvarchar](200) NULL,
	[Pics] [nvarchar](100) NULL,
	[Attachments] [nvarchar](100) NULL,
	[CreateAt] [datetime] NULL,
	CONSTRAINT [PK_iDailyReports] PRIMARY KEY CLUSTERED 
	(
		[ItemID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--iWeeklyReport
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[iWeeklyReport]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[iWeeklyReport] (
	[ItemID] [int] IDENTITY(1,1) NOT NULL,
	[TaskID] [int] NULL,
	[SN] [nvarchar](50) NULL,
	[Account] [nvarchar](50) NULL,
	[Date] [datetime] NULL,
	[Done] [nvarchar](200) NULL,
	[Undone] [nvarchar](200) NULL,
	[Coordinate] [nvarchar](200) NULL,
	[Comments] [nvarchar](200) NULL,
	[Pics] [nvarchar](100) NULL,
	[Attachments] [nvarchar](100) NULL,
	[CreateAt] [datetime] NULL,
	CONSTRAINT [PK_iWeeklyReport] PRIMARY KEY CLUSTERED 
	(
		[ItemID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--iMonthlyReport
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[iMonthlyReport]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[iMonthlyReport] (
	[ItemID] [int] IDENTITY(1,1) NOT NULL,
	[TaskID] [int] NULL,
	[SN] [nvarchar](50) NULL,
	[Account] [nvarchar](50) NULL,
	[Date] [datetime] NULL,
	[Done] [nvarchar](200) NULL,
	[Undone] [nvarchar](200) NULL,
	[Coordinate] [nvarchar](200) NULL,
	[Comments] [nvarchar](200) NULL,
	[Pics] [nvarchar](100) NULL,
	[Attachments] [nvarchar](100) NULL,
	[CreateAt] [datetime] NULL,
	CONSTRAINT [PK_iMonthlyReports] PRIMARY KEY CLUSTERED 
	(
		[ItemID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--YZAppNotesBarcode
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppNotesBarcode]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[YZAppNotesBarcode] (
	[ItemID] [int] IDENTITY(1,1) NOT NULL,
	[Account] [nvarchar](50) NOT NULL,
	[Barcode] [nvarchar](100) NOT NULL,
	[Format] [nvarchar](30) NULL,
	[ProductName] [nvarchar](200) NULL,
	[Comments] [nvarchar](200) NULL,
	[CreateAt] [datetime] NOT NULL,
	CONSTRAINT [PK_YZAppNotesBarcode] PRIMARY KEY CLUSTERED 
	(
		[ItemID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--YZAppNotesCash
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppNotesCash]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[YZAppNotesCash] (
	[ItemID] [int] IDENTITY(1,1) NOT NULL,
	[Account] [nvarchar](50) NOT NULL,
	[Type] [nvarchar](50) NOT NULL,
	[Date] [datetime] NULL,
	[Amount] [money] NOT NULL,
	[Invoice] [nvarchar](200) NULL,
	[Comments] [nvarchar](200) NULL,
	[CreateAt] [datetime] NULL,
	CONSTRAINT [PK_YZAppNotesCash] PRIMARY KEY CLUSTERED 
	(
		[ItemID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--YZAppNotesFootmark
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppNotesFootmark]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[YZAppNotesFootmark] (
	[ItemID] [int] IDENTITY(1,1) NOT NULL,
	[Account] [nvarchar](50) NOT NULL,
	[Time] [datetime] NOT NULL,
	[Rawlat] [float] NOT NULL,
	[Rawlon] [float] NOT NULL,
	[Lat] [float] NOT NULL,
	[Lon] [float] NOT NULL,
	[LocId] [nvarchar](50) NOT NULL,
	[LocName] [nvarchar](50) NOT NULL,
	[LocAddress] [nvarchar](300) NOT NULL,
	[Contact] [nvarchar](50) NULL,
	[Comments] [nvarchar](200) NULL,
	[Attachments] [nvarchar](200) NULL,
	[Date] [datetime] NOT NULL,
	CONSTRAINT [PK_YZAppNotesFootmark] PRIMARY KEY CLUSTERED 
	(
		[ItemID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--YZAppNotesSpeak
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZAppNotesSpeak]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[YZAppNotesSpeak] (
	[ItemID] [int] IDENTITY(1,1) NOT NULL,
	[Account] [nvarchar](50) NOT NULL,
	[FileID] [nvarchar](50) NOT NULL,
	[Duration] [int] NOT NULL,
	[Comments] [nvarchar](200) NULL,
	[CreateAt] [datetime] NULL,
	CONSTRAINT [PK_YZAppNotesSpeak] PRIMARY KEY CLUSTERED 
	(
		[ItemID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--YZMDExpenseType
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZMDExpenseType]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[YZMDExpenseType] (
	[Code] [nvarchar](50) NOT NULL,
	[Text] [nvarchar](50) NULL,
	[NameSpace] [nvarchar](30) NULL,
	[Image] [nvarchar](50) NULL,
	[OrderIndex] [int] NULL,
	CONSTRAINT [PK_YZMDExpenseType] PRIMARY KEY CLUSTERED 
	(
		[Code] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A01', N'飞机', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A01.png', 1)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A02', N'火车', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A02.png', 2)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A03', N'长途客车', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A03.png', 3)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A04', N'市内交通', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A04.png', 4)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A05', N'住宿', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A05.png', 5)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A06', N'餐饮', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A06.png', 6)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A07', N'补贴', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A07.png', 7)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A08', N'交际', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A08.png', 8)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A09', N'办公', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A09.png', 9)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A10', N'通讯', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A10.png', 10)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A11', N'水电', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A11.png', 11)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A12', N'招聘', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A12.png', 12)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A13', N'咨询', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A13.png', 13)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A14', N'房租', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A14.png', 14)
INSERT INTO YZMDExpenseType(Code, [Text], NameSpace, [Image], OrderIndex) VALUES (N'A15', N'其他', N'YZSoft$Local', N'YZSoft$Local/resources/images/expense/A15.png', 15)
END
GO

--YZMDLeavingType
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZMDLeavingType]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[YZMDLeavingType] (
	[TypeCode] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[OrderIndex] [int] NULL,
	CONSTRAINT [PK_YZMDLeavingType] PRIMARY KEY CLUSTERED 
	(
		[TypeCode] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
INSERT INTO YZMDLeavingType(TypeCode, [Name], OrderIndex) VALUES (N'Absence', N'事假', 3)
INSERT INTO YZMDLeavingType(TypeCode, [Name], OrderIndex) VALUES (N'Annual', N'年假', 1)
INSERT INTO YZMDLeavingType(TypeCode, [Name], OrderIndex) VALUES (N'Marital', N'婚假', 5)
INSERT INTO YZMDLeavingType(TypeCode, [Name], OrderIndex) VALUES (N'Maternity', N'产假', 6)
INSERT INTO YZMDLeavingType(TypeCode, [Name], OrderIndex) VALUES (N'Other', N'其他', 9)
INSERT INTO YZMDLeavingType(TypeCode, [Name], OrderIndex) VALUES (N'Overtime', N'调休', 2)
INSERT INTO YZMDLeavingType(TypeCode, [Name], OrderIndex) VALUES (N'Paternity', N'陪产假', 7)
INSERT INTO YZMDLeavingType(TypeCode, [Name], OrderIndex) VALUES (N'Road', N'路途假', 8)
INSERT INTO YZMDLeavingType(TypeCode, [Name], OrderIndex) VALUES (N'Sick', N'病假', 4)
END
GO

--YZMDProduct
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZMDProduct]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[YZMDProduct] (
	[ProductID] [int] IDENTITY(1,1) NOT NULL,
	[Barcode] [nvarchar](100) NULL,
	[Format] [nvarchar](50) NULL,
	[ProductName] [nvarchar](200) NULL,
	CONSTRAINT [PK_YZMDProduct] PRIMARY KEY CLUSTERED 
	(
		[ProductID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--YZMDProjects
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[YZMDProjects]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [dbo].[YZMDProjects] (
	[ProjectCode] [nvarchar](50) NOT NULL,
	[ProjectName] [nvarchar](50) NULL,
	[OrderIndex] [int] NULL,
	CONSTRAINT [PK_YZMDProjects] PRIMARY KEY CLUSTERED 
	(
		[ProjectCode] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
INSERT INTO YZMDProjects(ProjectCode, ProjectName, OrderIndex) VALUES (N'001', N'公司', 1)
INSERT INTO YZMDProjects(ProjectCode, ProjectName, OrderIndex) VALUES (N'002', N'BPM', 2)
INSERT INTO YZMDProjects(ProjectCode, ProjectName, OrderIndex) VALUES (N'003', N'BPA', 3)
INSERT INTO YZMDProjects(ProjectCode, ProjectName, OrderIndex) VALUES (N'004', N'市场营销', 4)
END
GO

/*********************app相关流程**********************/
--iDemoAppFields
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[iDemoAppFields]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[iDemoAppFields] (
	[TaskID] [int] NULL,
	[Text] [nvarchar](50) NULL,
	[Number] [money] NULL,
	[TextArea] [nvarchar](50) NULL,
	[DatePicker] [datetime] NULL,
	[Select] [nvarchar](50) NULL,
	[ImageAttachment] [nvarchar](200) NULL,
	[Attachment] [nvarchar](200) NULL,
	[Checkbox1] [nvarchar](50) NULL,
	[Checkbox2] [bit] NULL,
	[Radio] [nvarchar](50) NULL,
	[Toggle1] [bit] NULL,
	[Toggle2] [bit] NULL,
	[YearPicker] [datetime] NULL,
	[MonthPicker] [datetime] NULL,
	[WeekPicker] [datetime] NULL,
	[TimePicker] [datetime] NULL,
	[ExpandIconSelect] [nvarchar](50) NULL,
	[Email] [nvarchar](50) NULL,
	[Password] [nvarchar](50) NULL,
	[Users] [nvarchar](200) NULL,
	[SingleUser] [nvarchar](50) NULL
) ON [PRIMARY]
GO

--iDemoBusinessTrip
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[iDemoBusinessTrip]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[iDemoBusinessTrip] (
	[TaskID] [int] NOT NULL,
	[SN] [nvarchar](50) NULL,
	[Type] [nvarchar](50) NULL,
	[From] [datetime] NULL,
	[To] [datetime] NULL,
	[Days] [float] NULL,
	[Comments] [nvarchar](500) NULL,
	[Attachments] [nvarchar](100) NULL,
	CONSTRAINT [PK_YZDemoBusinessTrip] PRIMARY KEY CLUSTERED 
	(
		[TaskID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--iDemoExpense
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[iDemoExpense]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[iDemoExpense] (
	[TaskID] [int] NOT NULL,
	[SN] [nvarchar](50) NULL,
	[Title] [nvarchar](50) NULL,
	[Amount] [money] NULL,
	[Comments] [nvarchar](200) NULL,
	[Attachments] [nvarchar](100) NULL,
	CONSTRAINT [PK_iDemoExpense] PRIMARY KEY CLUSTERED 
	(
		[TaskID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--iDemoExpenseDetail
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[iDemoExpenseDetail]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[iDemoExpenseDetail] (
	[ItemID] [int] IDENTITY(1,1) NOT NULL,
	[TaskID] [int] NOT NULL,
	[Date] [datetime] NULL,
	[ProjectCode] [nvarchar](50) NULL,
	[TypeCode] [nvarchar](50) NULL,
	[Amount] [money] NULL,
	[Comments] [nvarchar](100) NULL,
	CONSTRAINT [PK_iDemoExpenseDetail] PRIMARY KEY CLUSTERED 
	(
		[ItemID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--iDemoLeaving
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[iDemoLeaving]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[iDemoLeaving] (
	[TaskID] [int] NOT NULL,
	[SN] [nvarchar](50) NULL,
	[LeaveType] [nvarchar](50) NULL,
	[LeaveFrom] [datetime] NULL,
	[LeaveTo] [datetime] NULL,
	[Days] [float] NULL,
	[Comments] [nvarchar](500) NULL,
	[Attachments] [nvarchar](100) NULL,
	CONSTRAINT [PK_YZDemoLeaving] PRIMARY KEY CLUSTERED 
	(
		[TaskID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--iDemoOutside
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[iDemoOutside]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[iDemoOutside] (
	[TaskID] [int] NOT NULL,
	[SN] [nvarchar](50) NULL,
	[Type] [nvarchar](50) NULL,
	[From] [datetime] NULL,
	[To] [datetime] NULL,
	[Days] [float] NULL,
	[Comments] [nvarchar](500) NULL,
	[Attachments] [nvarchar](100) NULL,
	CONSTRAINT [PK_YZDemoOutside] PRIMARY KEY CLUSTERED 
	(
		[TaskID] ASC
	) ON [PRIMARY]
) ON [PRIMARY]
GO

--iDemoFeedback
if not exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[iDemoFeedback]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
CREATE TABLE [dbo].[iDemoFeedback](
	[TaskID] [int] NULL,
	[SN] [nvarchar](50) NULL,
	[Date] [datetime] NULL,
	[Title] [nvarchar](50) NULL,
	[Comments] [nvarchar](50) NULL,
	[Attachments] [nvarchar](50) NULL
) ON [PRIMARY]
GO

if not exists (select * from BPMSysMobileAppFormFields WHERE XClass = 'YZSoft.src.field.ExpandIconSelect')
BEGIN
delete from BPMSysMobileAppFormFields
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'Ext.field.Text',N'Text',1)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'Ext.field.Number',N'Number',2)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'Ext.field.TextArea',N'TextArea',3)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'Ext.field.Field',N'Display',4)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'YZSoft.src.field.DatePicker',N'DatePicker',5)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'YZSoft.src.field.Select',N'Select',6)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'YZSoft.src.field.ImageAttachment',N'ImageAttachment',7)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'YZSoft.src.field.Attachment',N'Attachment',8)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'Ext.field.Checkbox',N'Checkbox',9)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'Ext.field.Radio',N'Radio',10)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'Ext.field.Toggle',N'Toggle',11)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'YZSoft.src.field.YearPicker',N'YearPicker',12)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'YZSoft.src.field.MonthPicker',N'MonthPicker',13)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'YZSoft.src.field.WeekPicker',N'WeekPicker',14)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'YZSoft.src.field.TimePicker',N'TimePicker',15)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'YZSoft.src.field.ExpandIconSelect',N'ExpandIconSelect',16)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'YZSoft.src.field.Users',N'Users',17)
INSERT INTO BPMSysMobileAppFormFields(XClass,[Desc],OrderIndex) VALUES(N'Ext.field.Email',N'Email',18)
END
GO

if not exists(select * from syscolumns where name = 'Checkbox3' and id = object_id('iDemoAppFields'))
BEGIN
ALTER TABLE iDemoAppFields ADD Checkbox3 [nvarchar](50) NULL;
END
GO
