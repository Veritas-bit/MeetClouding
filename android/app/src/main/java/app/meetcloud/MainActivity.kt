package app.meetcloud

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
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
                0 -> CloudFeed(
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

@Composable
private fun CloudFeed(
    clouds: List<CloudPost>,
    categories: List<String>,
    selectedCategory: String,
    onCategory: (String) -> Unit,
    interested: List<Int>,
    onInterest: (Int) -> Unit,
    onSelect: (CloudPost) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(start = 20.dp, top = 24.dp, end = 20.dp, bottom = 28.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("MEETCLOUD", color = Pink, fontSize = 12.sp, fontWeight = FontWeight.Bold, letterSpacing = 3.sp)
                Text("На что ты сегодня?", color = Color.White, fontSize = 29.sp, fontWeight = FontWeight.ExtraBold)
                Text("Найди людей, которым хочется того же.", color = Muted, fontSize = 14.sp)
            }
        }
        item {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = Panel,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Box(
                        modifier = Modifier.size(46.dp).background(
                            Brush.linearGradient(listOf(Violet, Pink)), CircleShape
                        ),
                        contentAlignment = Alignment.Center
                    ) { Icon(Icons.Default.LocationOn, contentDescription = null, tint = Color.White) }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Рядом с тобой", color = Color.White, fontWeight = FontWeight.SemiBold)
                        Text("Геолокация выключена в прототипе", color = Muted, fontSize = 12.sp)
                    }
                    TextButton(onClick = { onCategory("Все") }) { Text("Обзор", color = Pink) }
                }
            }
        }
        item {
            androidx.compose.foundation.lazy.LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(categories) { item ->
                    FilterChip(
                        selected = selectedCategory == item,
                        onClick = { onCategory(item) },
                        label = { Text(item) }
                    )
                }
            }
        }
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Облачка рядом", color = Color.White, fontSize = 19.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.weight(1f))
                Text("ДЕМО", color = Mint, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.5.sp)
            }
        }
        if (clouds.isEmpty()) {
            item {
                Surface(color = Panel, shape = RoundedCornerShape(18.dp)) {
                    Column(Modifier.fillMaxWidth().padding(20.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("Пока пусто", color = Color.White, fontWeight = FontWeight.Bold)
                        Text("Выбери другую категорию или создай своё облако.", color = Muted)
                    }
                }
            }
        }
        items(clouds, key = { it.id }) { cloud ->
            CloudCard(
                cloud = cloud,
                isInterested = interested.contains(cloud.id),
                onInterest = { onInterest(cloud.id) },
                onClick = { onSelect(cloud) }
            )
        }
        item {
            Text(
                "Карточки-примеры не являются реальными пользователями. Новые облака пока сохраняются только до закрытия приложения.",
                color = Muted, fontSize = 11.sp, lineHeight = 16.sp,
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
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
                Text("Чего тебе хочется? Позже это увидят люди поблизости.", color = Muted, fontSize = 13.sp)
                OutlinedTextField(value = title, onValueChange = { title = it.take(48) }, label = { Text("Короткое желание") }, singleLine = true)
                OutlinedTextField(value = description, onValueChange = { description = it.take(180) }, label = { Text("Подробности (необязательно)") }, minLines = 2)
                Text("Категория", color = Color.White, fontWeight = FontWeight.SemiBold)
                androidx.compose.foundation.lazy.LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    items(categories) { item ->
                        FilterChip(selected = category == item, onClick = { category = item }, label = { Text(item) })
                    }
                }
                Text("Черновик останется на устройстве в памяти приложения. Он не будет опубликован.", color = Mint, fontSize = 11.sp)
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
