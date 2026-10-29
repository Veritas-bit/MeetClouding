package app.meetcloud

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.offset
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ChatBubbleOutline
import androidx.compose.material.icons.filled.Cloud
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val Night = Color(0xFF101426)
private val Panel = Color(0xFF1B2138)
private val Muted = Color(0xFF9CA7C2)
private val Violet = Color(0xFF9B5CFF)
private val Pink = Color(0xFFFF62C7)
private val Mint = Color(0xFF8EF0C0)

private data class CloudPost(
    val id: Int,
    val title: String,
    val category: String,
    val time: String,
    val distance: String,
    val people: String,
    val description: String,
    val color: Color,
    val demo: Boolean = true
)

private val starterClouds = listOf(
    CloudPost(1, "Кофе и разговоры", "Общение", "В ближайший час", "Рядом с тобой", "1–2 человека", "Хочется выбраться из дома и поболтать без неловких ожиданий.", Color(0xFFB78AFF)),
    CloudPost(2, "Прогулка без маршрута", "Прогулка", "Сегодня", "Район не указан", "Компания до 3", "Просто пройтись, найти красивое место и посмотреть, куда приведёт вечер.", Color(0xFFFF88BD)),
    CloudPost(3, "Настолки или кооператив", "Игры", "Вечером", "Место уточним в чате", "Ещё 2 игрока", "Открыт к настолкам или спокойной кооперативной игре.", Color(0xFF7FE0C0))
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { MeetCloudApp() }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun MeetCloudApp() {
    var tab by remember { mutableStateOf(0) }
    var category by remember { mutableStateOf("Все") }
    var showCreate by remember { mutableStateOf(false) }
    var showDemoNotice by remember { mutableStateOf(false) }
    var selectedCloud by remember { mutableStateOf<CloudPost?>(null) }
    val clouds = remember { mutableStateListOf<CloudPost>().apply { addAll(starterClouds) } }
    val interested = remember { mutableStateListOf<Int>() }
    val categories = listOf("Все", "Общение", "Прогулка", "Игры", "Еда", "Спорт")

    MaterialTheme {
        Scaffold(
            containerColor = Night,
            bottomBar = {
                NavigationBar(containerColor = Panel, contentColor = Color.White) {
                    NavigationBarItem(
                        selected = tab == 0, onClick = { tab = 0 },
                        icon = { Icon(Icons.Default.Cloud, contentDescription = null) },
                        label = { Text("Облака") }
                    )
                    NavigationBarItem(
                        selected = tab == 1, onClick = { tab = 1 },
                        icon = { Icon(Icons.Default.ChatBubbleOutline, contentDescription = null) },
                        label = { Text("Чаты") }
                    )
                    NavigationBarItem(
                        selected = tab == 2, onClick = { tab = 2 },
                        icon = { Icon(Icons.Default.Settings, contentDescription = null) },
                        label = { Text("Профиль") }
                    )
                }
            },
            floatingActionButton = {
                if (tab == 0) {
                    androidx.compose.material3.FloatingActionButton(
                        onClick = { showCreate = true },
                        containerColor = Violet,
                        contentColor = Color.White
                    ) { Icon(Icons.Default.Add, contentDescription = "Создать облако") }
                }
            }
        ) { insets ->
            when (tab) {
                0 -> CloudMapScreen(
                    clouds = clouds.filter { category == "Все" || it.category == category },
                    categories = categories,
                    selectedCategory = category,
                    onCategory = { category = it },
                    interested = interested,
                    onInterest = { id -> if (!interested.contains(id)) interested.add(id) else interested.remove(id) },
                    onSelect = { selectedCloud = it },
                    modifier = Modifier.padding(insets)
                )
                1 -> ChatScreen(modifier = Modifier.padding(insets), onOpen = { showDemoNotice = true })
                else -> ProfileScreen(modifier = Modifier.padding(insets), onNotice = { showDemoNotice = true })
            }
        }
    }

    if (showCreate) {
        CreateCloudDialog(
            onDismiss = { showCreate = false },
            onCreate = { title, description, selected ->
                val categoryName = selected
                clouds.add(
                    0,
                    CloudPost(
                        id = (clouds.maxOfOrNull { it.id } ?: 0) + 1,
                        title = title,
                        category = categoryName,
                        time = "Время не указано",
                        distance = "Местоположение не указано",
                        people = "Ищу компанию",
                        description = description.ifBlank { "Пока без подробностей — можно обсудить в чате." },
                        color = Pink,
                        demo = false
                    )
                )
                category = "Все"
                tab = 0
                showCreate = false
            }
        )
    }

    selectedCloud?.let { cloud ->
        AlertDialog(
            onDismissRequest = { selectedCloud = null },
            containerColor = Panel,
            title = { Text(cloud.title, color = Color.White, fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(cloud.description, color = Color(0xFFE0E4F2))
                    Text("Это не бронь и не обещание: желание может измениться, а интерес к другим облачкам — появиться в любой момент.", color = Pink, fontSize = 12.sp)
                    Text("Время: ${cloud.time}", color = Muted)
                    Text("Место: ${cloud.distance}", color = Muted)
                    if (cloud.demo) {
                        Text("Демонстрационная карточка — это не реальный пользователь.", color = Mint, fontSize = 12.sp)
                    } else {
                        Text("Черновик хранится только в памяти приложения и не отправлен на сервер.", color = Mint, fontSize = 12.sp)
                    }
                }
            },
            confirmButton = {
                Button(onClick = { showDemoNotice = true; selectedCloud = null }) {
                    Text("Откликнуться")
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedCloud = null }) { Text("Закрыть", color = Muted) }
            }
        )
    }

    if (showDemoNotice) {
        AlertDialog(
            onDismissRequest = { showDemoNotice = false },
            containerColor = Panel,
            title = { Text("Тестовый режим", color = Color.White) },
            text = { Text("Это интерактивный прототип. Аккаунты, реальные облака, отклики и сообщения пока не отправляются на сервер.", color = Color(0xFFE0E4F2)) },
            confirmButton = { TextButton(onClick = { showDemoNotice = false }) { Text("Понятно") } }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CloudMapScreen(
    clouds: List<CloudPost>,
    categories: List<String>,
    selectedCategory: String,
    onCategory: (String) -> Unit,
    interested: List<Int>,
    onInterest: (Int) -> Unit,
    onSelect: (CloudPost) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier.fillMaxSize().padding(top = 18.dp, bottom = 8.dp)) {
        Column(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Text("MEETCLOUD", color = Pink, fontSize = 12.sp, fontWeight = FontWeight.Bold, letterSpacing = 3.sp)
            Text("Куда потянет сегодня?", color = Color.White, fontSize = 27.sp, fontWeight = FontWeight.ExtraBold)
            Text("Твоё желание — не обязательство. Посмотри, что ещё происходит рядом.", color = Muted, fontSize = 13.sp, lineHeight = 18.sp)
        }
        Spacer(Modifier.height(14.dp))
        androidx.compose.foundation.lazy.LazyRow(
            modifier = Modifier.fillMaxWidth(),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(categories) { item ->
                FilterChip(
                    selected = selectedCategory == item,
                    onClick = { onCategory(item) },
                    label = { Text(item) }
                )
            }
        }
        Spacer(Modifier.height(10.dp))
        Box(
            modifier = Modifier.fillMaxWidth().weight(1f).padding(horizontal = 10.dp)
                .clip(RoundedCornerShape(28.dp))
                .background(Color(0xFF151D31))
                .border(1.dp, Color(0xFF2B3650), RoundedCornerShape(28.dp))
        ) {
            Canvas(Modifier.fillMaxSize()) {
                val road = Color(0xFF26334B)
                val roadEdge = Color(0xFF34435D)
                val w = size.width
                val h = size.height
                // Stylised map artwork for the prototype; deliberately not real geography.
                for (i in 0..5) {
                    val x = w * (i / 5f)
                    drawLine(roadEdge, Offset(x, -h * 0.1f), Offset(x + w * 0.13f, h * 1.1f), strokeWidth = 3.dp.toPx())
                    drawLine(road, Offset(x + w * 0.035f, -h * 0.1f), Offset(x + w * 0.165f, h * 1.1f), strokeWidth = 15.dp.toPx())
                }
                for (i in 0..5) {
                    val y = h * (i / 5f)
                    drawLine(roadEdge, Offset(-w * 0.1f, y + h * 0.12f), Offset(w * 1.1f, y - h * 0.05f), strokeWidth = 3.dp.toPx())
                    drawLine(road, Offset(-w * 0.1f, y + h * 0.12f), Offset(w * 1.1f, y - h * 0.05f), strokeWidth = 13.dp.toPx())
                }
                drawCircle(Color(0xFF3C7D79).copy(alpha = 0.22f), radius = 52.dp.toPx(), center = Offset(w * 0.82f, h * 0.78f))
                drawCircle(Color(0xFF3C7D79).copy(alpha = 0.15f), radius = 32.dp.toPx(), center = Offset(w * 0.82f, h * 0.78f))
            }
            Row(
                modifier = Modifier.align(Alignment.TopStart).padding(12.dp)
                    .background(Color(0xDD101426), RoundedCornerShape(12.dp))
                    .padding(horizontal = 10.dp, vertical = 7.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Icon(Icons.Default.LocationOn, contentDescription = null, tint = Mint, modifier = Modifier.size(14.dp))
                Text("Карта желаний · демо", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.SemiBold)
            }
            if (clouds.isEmpty()) {
                Column(
                    modifier = Modifier.align(Alignment.Center).padding(28.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(Icons.Default.Cloud, contentDescription = null, tint = Muted, modifier = Modifier.size(36.dp))
                    Text("Пока здесь тихо", color = Color.White, fontWeight = FontWeight.Bold)
                    Text("Сними фильтр или добавь своё желание.", color = Muted, fontSize = 12.sp)
                }
            } else {
                BoxWithConstraints(Modifier.fillMaxSize()) {
                    val positions = listOf(
                        0.05f to 0.20f,
                        0.48f to 0.30f,
                        0.12f to 0.51f,
                        0.50f to 0.62f,
                        0.30f to 0.78f,
                        0.03f to 0.38f
                    )
                    clouds.take(6).forEachIndexed { index, cloud ->
                        val p = positions[index % positions.size]
                        CloudMapBubble(
                            cloud = cloud,
                            isInterested = interested.contains(cloud.id),
                            onClick = { onSelect(cloud) },
                            modifier = Modifier.offset(
                                x = maxWidth * p.first,
                                y = maxHeight * p.second
                            )
                        )
                    }
                }
            }
            Row(
                modifier = Modifier.align(Alignment.BottomCenter).fillMaxWidth()
                    .padding(12.dp).background(Color(0xE6101426), RoundedCornerShape(16.dp))
                    .padding(horizontal = 12.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(Icons.Default.Cloud, contentDescription = null, tint = Pink, modifier = Modifier.size(18.dp))
                Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text("Не выбирай навсегда — исследуй", color = Color.White, fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
                    Text("Тапни на любое облачко и посмотри, кто открыт к спонтанному плану.", color = Muted, fontSize = 10.sp, lineHeight = 14.sp)
                }
            }
        }
        Text(
            "Облачка на этой карте — примеры интерфейса, не реальные люди и не реальные координаты.",
            color = Muted, fontSize = 10.sp, lineHeight = 14.sp,
            modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)
        )
    }
}

@Composable
private fun CloudMapBubble(
    cloud: CloudPost,
    isInterested: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .widthIn(max = 158.dp)
            .clip(RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp, bottomEnd = 20.dp, bottomStart = 7.dp))
            .background(if (isInterested) Color(0xFF315E55) else Color(0xF21B2138))
            .border(1.dp, cloud.color.copy(alpha = 0.9f), RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp, bottomEnd = 20.dp, bottomStart = 7.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 10.dp),
        verticalArrangement = Arrangement.spacedBy(5.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(5.dp)) {
            Box(Modifier.size(7.dp).background(cloud.color, CircleShape))
            Text(cloud.category, color = cloud.color, fontSize = 9.sp, fontWeight = FontWeight.Bold, maxLines = 1)
        }
        Text(cloud.title, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp, lineHeight = 16.sp, maxLines = 2)
        Text(if (isInterested) "Тебе интересно" else "Открыто к идеям", color = Muted, fontSize = 9.sp, maxLines = 1)
    }
}

@Composable
private fun CloudCard(cloud: CloudPost, isInterested: Boolean, onInterest: () -> Unit, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = Panel),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(17.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Box(Modifier.size(10.dp).background(cloud.color, CircleShape))
                Text(cloud.category.uppercase(), color = cloud.color, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.4.sp)
                Spacer(Modifier.weight(1f))
                Text(if (cloud.demo) "ПРИМЕР" else "ЧЕРНОВИК", color = Muted, fontSize = 9.sp, fontWeight = FontWeight.Bold)
            }
            Text(cloud.title, color = Color.White, fontSize = 21.sp, fontWeight = FontWeight.Bold)
            Text(cloud.description, color = Color(0xFFD0D5E6), fontSize = 13.sp, lineHeight = 19.sp)
            Row(horizontalArrangement = Arrangement.spacedBy(14.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Schedule, contentDescription = null, tint = Muted, modifier = Modifier.size(15.dp))
                Text(cloud.time, color = Muted, fontSize = 11.sp)
                Icon(Icons.Default.LocationOn, contentDescription = null, tint = Muted, modifier = Modifier.size(15.dp))
                Text(cloud.distance, color = Muted, fontSize = 11.sp, maxLines = 1)
            }
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(cloud.people, color = Color(0xFFE4E7F2), fontSize = 12.sp)
                Spacer(Modifier.weight(1f))
                Button(
                    onClick = onInterest,
                    shape = RoundedCornerShape(13.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isInterested) Color(0xFF315E55) else cloud.color,
                        contentColor = if (isInterested) Mint else Night
                    )
                ) {
                    Icon(Icons.Default.FavoriteBorder, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.size(6.dp))
                    Text(if (isInterested) "Интерес есть" else "Интересно")
                }
            }
        }
    }
}

@Composable
private fun ChatScreen(modifier: Modifier = Modifier, onOpen: () -> Unit) {
    Column(
        modifier = modifier.fillMaxSize().padding(22.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Твои чаты", color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.ExtraBold)
        Text("Разговоры начинаются с общего желания.", color = Muted)
        Surface(color = Panel, shape = RoundedCornerShape(20.dp), modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Box(Modifier.size(48.dp).background(Brush.linearGradient(listOf(Violet, Pink)), CircleShape), contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.ChatBubbleOutline, contentDescription = null, tint = Color.White)
                }
                Text("Здесь пока тихо", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Text("Когда появятся реальные отклики, здесь будут ваши разговоры. В этой сборке чаты не подключены к серверу.", color = Muted, fontSize = 13.sp)
                TextButton(onClick = onOpen) { Text("О тестовом режиме", color = Pink) }
            }
        }
    }
}

@Composable
private fun ProfileScreen(modifier: Modifier = Modifier, onNotice: () -> Unit) {
    Column(modifier = modifier.fillMaxSize().padding(22.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Профиль", color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.ExtraBold)
        Surface(color = Panel, shape = RoundedCornerShape(20.dp), modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Box(Modifier.size(58.dp).background(Brush.linearGradient(listOf(Pink, Violet)), CircleShape), contentAlignment = Alignment.Center) {
                    Text("M", color = Color.White, fontSize = 25.sp, fontWeight = FontWeight.Bold)
                }
                Text("Твой будущий профиль", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text("Аккаунт пока не создан. Мы не просим геолокацию и не публикуем твоё местоположение.", color = Muted, fontSize = 13.sp)
                Button(onClick = onNotice, colors = ButtonDefaults.buttonColors(containerColor = Violet)) { Text("Возможности прототипа") }
            }
        }
        Text("В следующих сборках: вход, настройки приватности, блокировки и жалобы.", color = Muted, fontSize = 12.sp)
    }
}

@Composable
private fun CreateCloudDialog(onDismiss: () -> Unit, onCreate: (String, String, String) -> Unit) {
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Общение") }
    val categories = listOf("Общение", "Прогулка", "Игры", "Еда", "Спорт")
    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = Panel,
        title = { Text("Создать облако", color = Color.White, fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Что тебе сейчас хочется? Это настроение, а не жёсткий план — можно выбрать и чужую идею.", color = Muted, fontSize = 13.sp)
                OutlinedTextField(value = title, onValueChange = { title = it.take(48) }, label = { Text("Короткое желание") }, singleLine = true)
                OutlinedTextField(value = description, onValueChange = { description = it.take(180) }, label = { Text("Подробности (необязательно)") }, minLines = 2)
                Text("Категория", color = Color.White, fontWeight = FontWeight.SemiBold)
                androidx.compose.foundation.lazy.LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    items(categories) { item ->
                        FilterChip(selected = category == item, onClick = { category = item }, label = { Text(item) })
                    }
                }
                Text("В демо облачко останется только в памяти приложения. В продукте желание будет меняться, а чужие идеи можно будет подхватить в любой момент.", color = Mint, fontSize = 11.sp)
            }
        },
        confirmButton = {
            Button(onClick = { if (title.isNotBlank()) onCreate(title.trim(), description.trim(), category) }, enabled = title.isNotBlank()) {
                Text("Создать черновик")
            }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Отмена", color = Muted) } }
    )
}
