<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mainstay Calculator</title>
    <link rel="stylesheet" href="./calculator.css">
    <script
  src="https://code.jquery.com/jquery-3.6.1.min.js"
  integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ="
  crossorigin="anonymous"></script>
    <script src="./calculator-php.js"></script>
</head>
<body>
    <div class="calculator">
        <button class="secretbutton">Test (check console)</button>
        <div class="inner">
            <div class="copy">
                <h4>Before</h4>
                <h3>Onboarding is hard and expensive</h3>
                <h4>Now</h4>
                <h3>Not with Mainstay</h3>
                <p><strong>We do more than boost engagement &mdash;</strong> we save you money. Use our ROI calculator to see how much you could save during your onboarding process.</p>
            </div>
            
            <div class="right">
                <div class="form">
                    <div class="submission-form hidden">
                        <form>
                            <!-- First Name:
                            <input id="fname"/>
                            Last Name:
                            <input id="lname"/>
                            Email:
                            <input type="email" id="email"/> -->
                            <p>input fields go here</p>
                            <p>input fields go here</p>
                            <p>input fields go here</p>
                            <input type="submit">
                        </form>
                    </div>

                </div>

                <div class="bottom">
                    <div class="pagination"></div>
                    <button class="prev">Previous Step</button>
                    <button class="next">Next Step</button>
                </div>
            </div>
        </div>
    </div>

    <?php
        $promptsArray = array(
            0 => array(
                "prompt" => "This is question one.",
                "type" => "buttons",
                "responses" => array(
                    "0-200",
                    "200-400",
                    "400-600"
                )
            ),
            1 => array(
                "prompt" => "This is question two.",
                "type" => "buttons",
                "responses" => array(
                    "25%",
                    "50%",
                    "75%",
                    "100%"
                )
            ),
            2 => array(
                "prompt" => "This is question three.",
                "type" => "slider",
                "indicator" => "moving",
                "thumbSize" => "20",
                "min" => "0",
                "max" => "100000"
            ),
            3 => array(
                "prompt" => "This is question four.",
                "type" => "buttons",
                "responses" => array(
                    "0-10",
                    "10-20",
                    "20-30",
                    "30+"
                )
            ),
        );
        echo "<br>";
        print_r($promptsArray);
        echo "<br><br>";
        $jsonPrompts = json_encode($promptsArray);
        print_r($jsonPrompts);
    ?>

    <script>
        const questions = <?php echo $jsonPrompts; ?>;
    </script>

</body>
</html>



