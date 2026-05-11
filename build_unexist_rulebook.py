from pathlib import Path
import math

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Flowable,
    HRFlowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


def _register_korean_fonts():
    # Try common CID fonts first; fallback to Windows fonts if needed.
    candidates = [
        ("HYGothic-Medium", "HYSMyeongJo-Medium"),
        ("HYGoThic-Medium", "HYSMyeongJo-Medium"),
    ]

    for gothic, serif in candidates:
        try:
            pdfmetrics.registerFont(UnicodeCIDFont(gothic))
            pdfmetrics.registerFont(UnicodeCIDFont(serif))
            return gothic, serif
        except Exception:
            pass

    windows_fonts = Path(r"C:\Windows\Fonts")
    gothic_path = windows_fonts / "malgun.ttf"
    serif_path = windows_fonts / "batang.ttc"

    if gothic_path.exists():
        pdfmetrics.registerFont(TTFont("MalgunGothic", str(gothic_path)))
        gothic = "MalgunGothic"
    else:
        gothic = "Helvetica"

    if serif_path.exists():
        pdfmetrics.registerFont(TTFont("Batang", str(serif_path)))
        serif = "Batang"
    else:
        serif = gothic

    return gothic, serif


GOTHIC, SERIF = _register_korean_fonts()
W, H = A4

# Colors
DARK = colors.HexColor("#0D0D1A")
MID = colors.HexColor("#111126")
CARD = colors.HexColor("#181830")
BORDER = colors.HexColor("#28285A")
GOLD = colors.HexColor("#C9A84C")
GOLD_L = colors.HexColor("#E8C97A")
TEAL = colors.HexColor("#4FC3B8")
LAV = colors.HexColor("#9B8FC8")
MIST = colors.HexColor("#6A9CB0")
ROSE = colors.HexColor("#C07080")
WHITE = colors.HexColor("#EDE9E0")
GRAY = colors.HexColor("#7A7A9A")
GRAY_L = colors.HexColor("#AAAACC")
GREEN = colors.HexColor("#5A9A6A")


def mk_style(
    name,
    font=GOTHIC,
    size=9,
    color=WHITE,
    leading=None,
    align=TA_LEFT,
    spaceBefore=2,
    spaceAfter=2,
    leftIndent=0,
):
    return ParagraphStyle(
        name,
        fontName=font,
        fontSize=size,
        textColor=color,
        leading=leading or size * 1.5,
        alignment=align,
        spaceBefore=spaceBefore * mm,
        spaceAfter=spaceAfter * mm,
        leftIndent=leftIndent * mm,
    )


S_TITLE = mk_style("title", GOTHIC, 26, GOLD, 32, TA_LEFT, 4, 2)
S_PART = mk_style("part", GOTHIC, 15, GOLD, 20, TA_LEFT, 6, 2)
S_HEAD = mk_style("head", GOTHIC, 11, TEAL, 16, TA_LEFT, 4, 1)
S_BODY = mk_style("body", GOTHIC, 8, WHITE, 13, TA_JUSTIFY, 1, 1)


class HexBoard(Flowable):
    def __init__(self, width=120 * mm, height=75 * mm):
        super().__init__()
        self.width = width
        self.height = height

    def draw(self):
        c = self.canv
        s = 9
        dx = s * math.sqrt(3)
        dy = s * 1.5
        cx = self.width / 2
        cy = self.height / 2 - 5 * mm
        layout = [(3, -1.0), (4, -1.5), (5, -2.0), (4, -1.5), (3, -1.0)]
        fog, visited, gate = {(0, 1), (1, 3), (4, 2), (3, 0)}, {(2, 1), (2, 3), (1, 1), (3, 2), (0, 2)}, (2, 2)
        players = {(1, 2): TEAL, (3, 1): LAV, (0, 0): MIST}
        for ri, (cnt, ox) in enumerate(layout):
            for ci in range(cnt):
                x, y, key = cx + (ox + ci) * dx, cy + (2 - ri) * dy, (ri, ci)
                pts = [(x + s * 0.88 * math.cos(math.radians(60 * i - 30)), y + s * 0.88 * math.sin(math.radians(60 * i - 30))) for i in range(6)]
                p = c.beginPath()
                p.moveTo(*pts[0])
                for pt in pts[1:]:
                    p.lineTo(*pt)
                p.close()
                if key == gate:
                    c.setFillColor(colors.HexColor("#2A1800"))
                    c.setStrokeColor(GOLD)
                    c.setLineWidth(1.2)
                elif key in fog:
                    c.setFillColor(colors.HexColor("#1A0828"))
                    c.setStrokeColor(colors.HexColor("#4A2A5A"))
                    c.setLineWidth(0.5)
                elif key in visited:
                    c.setFillColor(colors.HexColor("#0A1E2E"))
                    c.setStrokeColor(colors.HexColor("#1A4060"))
                    c.setLineWidth(0.5)
                else:
                    c.setFillColor(colors.HexColor("#0A1420"))
                    c.setStrokeColor(BORDER)
                    c.setLineWidth(0.4)
                c.drawPath(p, fill=1, stroke=1)
                if key == gate:
                    c.setFillColor(GOLD)
                    c.setFont(SERIF, 6)
                    c.drawCentredString(x, y - 2.5, "영원의 문")
                elif key in fog:
                    c.setFillColor(colors.HexColor("#4A2A5A"))
                    c.setFont(GOTHIC, 7)
                    c.drawCentredString(x, y - 3, "풍화")
                if key in players:
                    c.setFillColor(players[key])
                    c.circle(x, y + 1, 3.5, fill=1, stroke=0)


class PersonalBoard(Flowable):
    def __init__(self, width=175 * mm, height=55 * mm):
        super().__init__()
        self.width = width
        self.height = height

    def draw(self):
        c = self.canv
        w2, h2 = self.width, self.height
        hw = w2 / 2 - 3 * mm
        c.setFillColor(colors.HexColor("#0A1E2E"))
        c.setStrokeColor(TEAL)
        c.setLineWidth(0.8)
        c.roundRect(0, 0, hw, h2, 3 * mm, fill=1, stroke=1)
        c.setFillColor(TEAL)
        c.setFont(GOTHIC, 8)
        c.drawCentredString(hw / 2, h2 - 6 * mm, "[ 생존 면 ]")
        score_colors = {
            0: ROSE,
            1: colors.HexColor("#8888AA"),
            2: colors.HexColor("#8888AA"),
            3: colors.HexColor("#8888AA"),
            4: WHITE,
            5: WHITE,
            6: WHITE,
            7: WHITE,
            8: colors.HexColor("#CCAA44"),
            9: colors.HexColor("#CCAA44"),
            10: ROSE,
        }
        for i in range(11):
            bx, by, bw = 3 * mm + i * (hw - 6 * mm) / 10, h2 - 23 * mm, (hw - 8 * mm) / 10
            c.setFillColor(score_colors[i])
            c.roundRect(bx, by, bw, 7 * mm, 1 * mm, fill=1, stroke=1)
            c.setFillColor(DARK)
            c.setFont(GOTHIC, 6.5)
            c.drawCentredString(bx + bw / 2, by + 1.5 * mm, str(i))


class WeatheringExample(Flowable):
    def __init__(self, width=175 * mm, height=45 * mm):
        super().__init__()
        self.width = width
        self.height = height

    def draw(self):
        c = self.canv
        s = 8.5
        dx, dy = s * math.sqrt(3), s * 1.5

        def mini(ox_v, state):
            cx, cy = ox_v + 30 * mm, self.height / 2 - 3 * mm
            layout = [(3, -1.0), (4, -1.5), (5, -2.0), (4, -1.5), (3, -1.0)]
            for ri, (cnt, ox) in enumerate(layout):
                for ci in range(cnt):
                    x, y, key = cx + (ox + ci) * dx, cy + (2 - ri) * dy, (ri, ci)
                    if key in state.get("gone", set()):
                        continue
                    fc = colors.HexColor("#2A0A3A") if key in state.get("fog", set()) else (colors.HexColor("#2A1800") if key == (2, 2) else colors.HexColor("#0A1420"))
                    sc = colors.HexColor("#5A2A6A") if key in state.get("fog", set()) else (GOLD if key == (2, 2) else BORDER)
                    pts = [(x + s * 0.85 * math.cos(math.radians(60 * i - 30)), y + s * 0.85 * math.sin(math.radians(60 * i - 30))) for i in range(6)]
                    p = c.beginPath()
                    p.moveTo(*pts[0])
                    for pt in pts[1:]:
                        p.lineTo(*pt)
                    p.close()
                    c.setFillColor(fc)
                    c.setStrokeColor(sc)
                    c.drawPath(p, fill=1, stroke=1)

        mini(0, {"fog": set(), "gone": set()})
        mini(70 * mm, {"fog": {(0, 0)}, "gone": {(0, 2)}})
        mini(140 * mm, {"gone": {(0, 1), (0, 2), (4, 2)}})


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(DARK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFillColor(MID)
    canvas.rect(0, H - 12 * mm, W, 12 * mm, fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.rect(0, H - 13 * mm, W, 1 * mm, fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.setFont(GOTHIC, 9)
    canvas.drawString(10 * mm, H - 9 * mm, "UNEXIST - 잊혀진 자들의 섬")
    canvas.drawRightString(W - 10 * mm, H - 9 * mm, "룰북 v0.3 (퍼블리셔 제출용)")
    canvas.setFillColor(GRAY)
    canvas.setFont(GOTHIC, 7)
    canvas.drawCentredString(W / 2, 8 * mm, f"- {doc.page} -")
    canvas.restoreState()


def build_rulebook(output_path=None):
    target = Path(output_path) if output_path else (Path.cwd() / "unexist_rulebook_v03.pdf")
    doc = SimpleDocTemplate(
        str(target),
        pagesize=A4,
        leftMargin=13 * mm,
        rightMargin=13 * mm,
        topMargin=18 * mm,
        bottomMargin=16 * mm,
    )
    story = []
    hr = HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=3 * mm, spaceBefore=2 * mm)

    def h1(txt):
        return Paragraph(txt, S_PART)

    def h2(txt):
        return Paragraph(txt, S_HEAD)

    def b(txt):
        return Paragraph(txt, S_BODY)

    story.append(Spacer(1, 20 * mm))
    story.append(Paragraph("UNEXIST", S_TITLE))
    story.append(Paragraph("잊혀진 자들의 섬", mk_style("sub", GOTHIC, 16, GRAY_L, 22)))
    story.append(Spacer(1, 6 * mm))
    story.append(b("본 문서는 퍼블리셔 제출용 룰북 시안입니다."))
    story.append(PageBreak())

    story.append(h1("1. 게임 개요"))
    story.append(hr)
    story.append(b("UNEXIST는 기억, 안개, 생존을 테마로 한 전략 보드게임입니다."))
    story.append(h2("핵심 구조"))
    story.append(b("플레이어는 헥사 타일 보드를 이동하며 인장을 수집하고, 특정 조건에서 승리를 선언합니다."))
    story.append(Spacer(1, 3 * mm))
    story.append(HexBoard())
    story.append(PageBreak())

    story.append(h1("2. 개인 보드"))
    story.append(hr)
    story.append(b("개인 보드는 생존 면과 안개 면으로 구성됩니다. 상황에 따라 점수 흐름과 위험도가 달라집니다."))
    story.append(Spacer(1, 2 * mm))
    story.append(PersonalBoard())
    story.append(Spacer(1, 4 * mm))
    story.append(h2("풍화 예시"))
    story.append(WeatheringExample())
    story.append(PageBreak())

    story.append(h1("9. 승리 조건"))
    story.append(hr)
    win_data = [
        ["승리 방식", "조건"],
        ["9.1. 부활 승리", "인장 5종 모두 보유 + 영원의 문 타일 위치 + 균형 페이즈에 승리 선언"],
        ["9.2. 시간 제한", "8라운드 후 승자 없으면 인장 가장 많은 플레이어 승리. 동률 시 존재 점수 높은 쪽"],
        ["9.3. 안개 군주", "조작/도청 3회 이상 사용 + 게임 종료 시 부활 승리자 없음 (무승부 저지)"],
    ]
    win_t = Table(win_data, colWidths=[35 * mm, 140 * mm])
    win_t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1A1A35")),
                ("TEXTCOLOR", (0, 0), (-1, 0), GOLD),
                ("BACKGROUND", (0, 1), (-1, -1), CARD),
                ("TEXTCOLOR", (0, 1), (0, -1), GOLD_L),
                ("TEXTCOLOR", (1, 1), (1, -1), WHITE),
                ("FONTNAME", (0, 0), (-1, -1), GOTHIC),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("GRID", (0, 0), (-1, -1), 0.4, BORDER),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(win_t)

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    return target


if __name__ == "__main__":
    output = build_rulebook()
    print(f"PDF 생성 완료: {output}")
